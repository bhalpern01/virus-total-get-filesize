module.exports = class Attack {
    constructor(attackData) {
        this.attack = attackData;
    }

    getAttackData() {
        return this.attack;
    }

    setFileSize(md5Hash, size) {
        this.attack.data.malwareFiles.forEach(file => {
            if (file.md5 === md5Hash) {
                file.size = size;
                return;
            }
        })
    }
}