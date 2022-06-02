const crypt = {
  secret: "Amazing:D",

  decrypt: function (cipher) {
    let decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    decipher = decipher.toString(CryptoJS.enc.Utf8);
    return decipher;
  },
};
