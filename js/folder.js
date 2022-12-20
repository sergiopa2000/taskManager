class Folder {

    constructor(config){
        this.id = config.id;
        this.name = config.name;
        this.color = config.color;
        this.tasks = config.tasks || [];
    }

    initEvent(folder, allTasks, allFolders){
        folder.draggable({ 
            scroll: false , 
            containment: "parent", 
            stack: "div",
            stop: (e, ui) =>{
                let element = $("#" + this.id);
                this.updatePosition(element.position());
            }
        });

        folder.droppable({
            accept: ".task",
            drop: ( event, ui ) => {
                let item = ui.draggable;
                let taskObject = allTasks.find((task) => task.id == item.attr("id"));
                let previousFolder = allFolders.find((folder) => folder.id == ui.draggable.parent().attr("id"));
                // Eliminamos la task de su anterior carpeta si estaba en una
                if(previousFolder){
                    console.log(previousFolder.tasks.indexOf(taskObject));
                    previousFolder.tasks.splice(previousFolder.tasks.indexOf(taskObject), 1);
                    previousFolder.update();
                }
                // Lo metemos en la nueva carpeta
                this.tasks.push(taskObject);
                this.update();

                taskObject.idFolder = this.id;
                taskObject.update();

                if(!item.data("inFolder")){
                    item.addClass("inFolder");
                    item.removeClass("global");
                    item.fadeOut(function() {
                        item.appendTo(event.target).fadeIn("slow", function() {
                            item.animate({ opacity: 1 })
                          });
                    })
                }
            }
        });
        
        folder.resizable({
            resize : function(e) {
                let element = $(e.target);
                element.css("height", "fit-content")
            }        
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
                type: "folder",
                id: this.id
            })
        });
        const content = await rawResponse.json();
    }

    async create(){
        const rawResponse = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "folder",
                data: this
            })
        });
        const content = await rawResponse.json();
        console.log(content);
    }

    async update(){
        const rawResponse = await fetch('http://localhost:3000', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "folder",
                data: this
            })
        });
        const content = await rawResponse.json();
        console.log(content);
    }

    async updatePosition(position){
        const rawResponse = await fetch('http://localhost:3000/updatePosition', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "folder",
                id: this.id,
                position: {
                    top: position.top,
                    left: position.left
                }
            })
        });
        const content = await rawResponse.json();
        console.log(content);
    }
}

export {Folder};