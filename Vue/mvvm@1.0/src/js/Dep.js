class Dep {
    constructor () {
        console.log(this)
        this.list = []
    }

    listen (subs) {
        this.list.push(subs)
    }

    notify () {
        this.list.forEach(subs => {
            subs.update()
        })
    }
}

Dep.prototype.target = null

export default Dep