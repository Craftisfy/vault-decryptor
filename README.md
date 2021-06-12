# Vault Decryptor

A web UI for decrypting MetaMask local storage.

[Visit live page here](https://craftisfy.github.io/vault-decryptor/)

## Pre-requisites:

To run the vault decryptor locally, ensure both Beefy and Browserify are installed:

`npm install -g browserify`

`npm install -g beefy`

## To run:

`npm start`

## To build:

`npm run build`

Then just include `bundle.js` in an HTML file.

## Feature Auto Guess Metamask Password Guide

1. copy and paster your vault data
1. enter min password length and max password length (more length = more time)
1. enter possible characters 
    1. The letter 'a' and 'A' are different
    1. Do not type duplicate letter as the same letter case. 
        1. Don't !! type 'aa' or 'abcdcda' etc.
        1. Do !! type 'abcdefgABCDEFG'
    1. More letters take more time.
1. click auto guess password
1. wait and see result