class Task {
    constructor(config){
        this.id = config.id;
        this.title = config.title;
        this.color = config.color;
        this.content = config.content;
        this.idFolder = config.idFolder;
    }

    initEvent(task){
        task.draggable({
            stack: "div",
            scroll: false, 
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: true, // when not dropped, the item will revert back to its initial position
            containment: "#task-container",
        });
    }

    async delete(){
        const rawResponse = await fetch('http://localhost:3000', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "task",
                data: this.id,
            })
        });
        const content = await rawResponse.json();
        return content;
    }

    async create(){
        const rawResponse = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "task",
                data: this
            })
        });
        const content = await rawResponse.json();
        console.log(content);
        return content;
    }

    async update(){
        const rawResponse = await fetch('http://localhost:3000', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "task",
                data: this
            })
        });
        const content = await rawResponse.json();
        console.log(content);
        return content;
    }
}

export {Task};