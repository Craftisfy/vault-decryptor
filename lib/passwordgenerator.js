module.exports = passwordGenerator

function passwordGenerator() {
    let _possibleCharacters = []
    let _possibleCharactersLength = 0
    let _lastPossibleCharacterIndex = 0
    let _characterIndexList = []
    let _lastIndexOfCharacterIndex = 0

    const setPossibleCharacters = (possibleCharacters) => {
        _possibleCharacters = possibleCharacters
        _possibleCharactersLength = possibleCharacters.length
        _lastPossibleCharacterIndex = possibleCharacters.length - 1
    }

    const setCharIndexList = (charIndexArray) => {
        _characterIndexList = charIndexArray
        _lastIndexOfCharacterIndex = charIndexArray.length - 1
    }

    const initArray = (arraySize) => {
        let arrayList = []
        for(let i = 0; i < arraySize; i++) {
            arrayList.push(0)
        }
        _characterIndexList = arrayList
        _lastIndexOfCharacterIndex = arrayList.length - 1
    } 

    const getPassword = () => {
        let password = ''
        for(let i = 0; i < _characterIndexList.length; i++) {
            let characterIndex = _characterIndexList[i]
            password += '' + _possibleCharacters[characterIndex]
        }
        console.log('password:', password)
        return password
    }

    const moveNext = () => {
        _characterIndexList[_lastIndexOfCharacterIndex]++

        for(let i = _lastIndexOfCharacterIndex; i >= 0; i--) {
            if(_characterIndexList[i] > _lastPossibleCharacterIndex) {
                _characterIndexList[i-1]++
                _characterIndexList[i] = 0
            }
        }

        if(_characterIndexList[0] > _lastPossibleCharacterIndex)
        {
            return false;
        }    
        return true
    }

    return {
        setPossibleCharacters,
        setCharIndexList,
        initArray,
        moveNext,
        getPassword
    }
}
