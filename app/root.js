const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const passworder = require('browser-passworder')
const pwdGen = require('../lib/passwordgenerator')
const passwordGenerator = pwdGen()
module.exports = connect(mapStateToProps)(AppRoot)

function mapStateToProps (state) {
  return {
    view: state.currentView,
    nonce: state.nonce,
  }
}

inherits(AppRoot, Component)
function AppRoot () {
  Component.call(this)
  this.state = {
    vaultData: '',
    password: '',
    passwordGenerated: '',
    passwordMinLength: 8,
    passwordMaxLength: 8,
    possibleCharacters: [],
    error: null,
    decrypted: null,
  }
}

AppRoot.prototype.render = function () {
  const props = this.props
  const state = this.state || {}
  const { error, decrypted } = state

  return (
    h('.content', [
      h('div', {
        style: {
        },
      }, [
        h('h1', `MetaMask Vault Decryptor`),

        h('a', {
          href: 'https://metamask.zendesk.com/hc/en-us/articles/360015289852-How-to-Copy-Your-Vault-Data',
          target: '_blank'
        }, 'How to Copy Your Vault Data'),
        h('br'),

        h('a', {
          href: 'https://github.com/Craftisfy/vault-decryptor',
        }, 'Fork on Github'),
        h('br'),

        h('textarea.vault-data', {
          style: {
            width: '600px',
            height: '300px'
          },
          placeholder: 'Paste your vault data here.',
          onChange: (event) => {
            const vaultData = event.target.value
            this.setState({ vaultData })
          },
        }),
        h('br'),
        h('input.password', {
          type: 'password',
          placeholder: 'Password',
          onChange: (event) => {
            const password = event.target.value
            this.setState({ password })
          },
        }),
        h('br'),
        h('button.decrypt', {
          onClick: this.decrypt.bind(this),
        }, 'Decrypt'),
        h('br'),
        h('hr'),
        h('br'),
        h('br'),
        h('label',`Password Min Length`),
        h('input',{
          type: 'number',
          onChange: (event) => {
            const passwordMinLength = parseInt(event.target.value)
            this.setState({ passwordMinLength })
          },
        }),
        h('br'),
        h('br'),
        h('label',`Password Max Length`),
        h('input',{
          type: 'number',
          onChange: (event) => {
            const passwordMaxLength = parseInt(event.target.value)
            this.setState({ passwordMaxLength })
          }
        }),
        h('br'),
        h('br'),
        h('label', `Possible Characters`),
        h('input',{
          type: 'text',
          style: {
            width: '600px'
          },
          onChange: (event) => {
            const possibleCharacters = Array.from(event.target.value)
            this.setState({ possibleCharacters })
            passwordGenerator.setPossibleCharacters(possibleCharacters)
          }
        }),
        h('br'),
        h('br'),
        h('button.decrypt', {
          type: 'button',
          onClick: this.autoDecrypt.bind(this),
        }, 'Auto Guess Password'),
        h('br'),
        h('br'),
        h('input', {
          type: 'text',
          value: this.state.passwordGenerated,
          readOnly: true,
          style: {
            border: '1px solid #bbb',
            backgroundColor: '#ddd',
            width: '300px'
          }
        }),
        h('br'),
        h('br'),
        error ? h('.error', {
          style: { color: 'red' },
        }, error) : null,

        decrypted ? h('div',{
          style: {
            color:'green'
          }
        },[
          h('div',{
            style: {
              borderBottom: '1px solid blue'
            }
          }, decrypted),
          h('div',[
            h('span','Your password is: '),
            h('span', this.state.passwordGenerated)
          ])
        ]) : null,
      ])
    ])
  )
}

AppRoot.prototype.decrypt = function(event) {
  const { password, vaultData } = this.state

  let vault
  try {
    vault = vaultData
  } catch (e) {
    console.error(e)
    return this.setState({ error: 'Problem decoding vault: ' + JSON.stringify(e) })
  }

  passworder.decrypt(password, vault)
  .then((decryptedObj) => {
    const decrypted = JSON.stringify(decryptedObj)
    console.log('Decrypted!', decrypted)
    this.setState({ decrypted })
  })
  .catch((reason) => {
    console.error(reason)
    this.setState({ error: 'Problem decoding vault.' })
  })
}

AppRoot.prototype.autoDecrypt = function(event){
  const { vaultData, passwordMinLength, passwordMaxLength } = this.state
  let vault
  try {
    vault = vaultData
  } catch (e) {
    console.error(e)
    return this.setState({ error: 'Invalid JSON :' + JSON.stringify(e) })
  }

  const isDecryptSuccess = () => { return this.state.decrypted !== null }
  const letDecrypt = async (password) => {
    let result = await passworder.decrypt(password, vault)
      .then((decryptedObj) => {
        const decrypted = JSON.stringify(decryptedObj)
        console.log('Congratulation!!!! You got seed phrase:', decrypted)
        this.setState({ decrypted })
        this.setState({ error: null })
      })
      .catch((reason) => {
        console.error(`Incorrect password : ${password}`)
        this.setState({ error: `Incorrect password : ${password}` })
      })
    
      return result
  }

  const guessPasswordByLength = async (passwordLength) => {
    passwordGenerator.initArray(passwordLength)
    
    let counter = 1;

    while (!isDecryptSuccess()) {
      const passwordGenerated =  passwordGenerator.getPassword()
      this.setState({ passwordGenerated })
      var result = await letDecrypt(passwordGenerated)

      if(isDecryptSuccess())
        break
     
      passwordGenerator.moveNext()
      counter++

      if(counter % 100 === 0) {
        console.clear()
        console.log(`$------------ total guess password: ${counter} ---------------`)
      }
    }
  }

 
  for (let passwordLength = passwordMinLength; passwordLength <= passwordMaxLength; passwordLength++) {
    
    if(isDecryptSuccess())
      break

    guessPasswordByLength(passwordLength)
  }
  
}
