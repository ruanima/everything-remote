const jsftp = require("jsftp");
const path = require('path')


export class EtpClient {
    constructor() {
        this.config = {
            host: '192.168.123.100',
        }
        this.mountPoints = {
            'E:': '/Volumes/storage',
            'F:': '/Volumes/storage1',
        }
        this.pageSize = 2   // todo
        this._client = null
    }

    async connect() {
        if (!this._client) {
            this._client = new jsftp(this.config)
        }
        await this.sendCmd('OPTS UTF8 ON')
        await this.sendCmd('EVERYTHING SIZE_COLUMN 1')
        await this.sendCmd('EVERYTHING DATE_MODIFIED_COLUMN 1')
        await this.sendCmd('EVERYTHING PATH_COLUMN 1')
        await this.sendCmd(`EVERYTHING COUNT ${this.pageSize}`)
    }

    sendCmd(cmd) {
        return new Promise((resolve, reject) => {
            this._client.raw(cmd, (err, data) => {
                if (err) {
                    console.error(err)
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    async search(word) {
        await this.sendCmd(`EVERYTHING SEARCH ${word}`)
        let data = await this.sendCmd('EVERYTHING QUERY')
        return this.parseResult(data.text)
    }

    async offset(num) {
        await this.sendCmd(`EVERYTHING OFFSET ${num}`)
        let data = await this.sendCmd('EVERYTHING QUERY')
        return this.parseResult(data.text)
    }

    async reSize(size) {
        await this.sendCmd(`EVERYTHING COUNT ${size}`)
        this.pageSize = size
    }

    async close() {
        return await this.sendCmd('quit')
    }

    parseResult(text) {
        let lines = text.split('\n')
        let total = lines[1].trim().split(' ')[1]
        let res = {
            total: Number(total),
            data: [],
        }
        var tmp = {}
        for (let i=2; i< lines.length-1; i++) {
            let line = lines[i].trim()
            // console.log(line)
            if (Object.keys(tmp).length != 0 && line.startsWith('PATH')) {
                res.data.push(tmp)
                tmp = {}
            }
            let pos = line.indexOf(' ')
            tmp[line.substr(0, pos)] = line.substr(pos+1)
        }
        if (Object.keys(tmp).length != 0) {
            res.data.push(tmp)
        }
        for (let record of res.data) {
            let parts = record['PATH'].split('\\')
            if (parts[0] in this.mountPoints) {
                parts[0] = this.mountPoints[parts[0]]
                record['TRANS_PATH'] = path.join(...parts)
                record['NAME'] = record['FOLDER'] || record['FILE']
            }
        }
        return res
    }
}


( async () => {
    try {
        var c = new EtpClient()
        await c.connect()
        let data = await c.search('猛男')
        console.log(data)
        data = await c.offset(2)
        console.log(data)
        // await c.sendCmd('EVERYTHING SEARCH 猛男')
        // await c.sendCmd('EVERYTHING COUNT 2')
        // var text = await c.sendCmd('EVERYTHING QUERY')
        // console.log(text.text)
        // console.log('====================')
        // await c.sendCmd('EVERYTHING OFFSET 2')  // offset 2 limit 2
        // var text = await c.sendCmd('EVERYTHING QUERY')
        // console.log(text.text)
        // console.log(c.parseResult(text.text))
    } catch (error) {
        console.error(error);
    } finally {
        await c.close()
    }
})()

// let p = 'E:\\书籍\\新建文件夹\\书库 1\\05外国名著_14595'
// console.log(p.split('\\'))

