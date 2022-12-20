import {Folder} from "./folder.js"
import {Task} from "./task.js"

function createTaskByJson(task, folders){
    console.log(task);
    let newTask = new Task(task);
    let taskDiv = $('<div/>',{
        id: task.id,
        class: 'task'
    })
    if(newTask.idFolder){
        let folderDom = $(`#${newTask.idFolder}`);
        let folderObject = folders.find(folder => folder.id == newTask.idFolder);
        folderObject.tasks.push(newTask);
        taskDiv.addClass("inFolder");
        taskDiv.appendTo(folderDom);
    }else{
        taskDiv.appendTo('#task-container');
    }
    taskDiv.css("backgroundColor", newTask.color);
    taskDiv.css("color", getContrast(newTask.color));
    taskDiv.data("inFolder", false)

    $(`<p class="taskTitle">${newTask.title}</p>`).appendTo(taskDiv);
    $(`<p class="taskContent">${newTask.content}</p>`).appendTo(taskDiv);

    newTask.initEvent(taskDiv);
    return newTask;
}

function createFolderByJson(folder, folders, tasks){
    let newFolder = new Folder(folder);
    let folderDiv = $('<div/>',{
        id: newFolder.id,
        class: 'folder'
    }).appendTo('#task-container');
    folderDiv.css("backgroundColor", folder.color);
    folderDiv.css("color", getContrast(folder.color));
    if(folder.position){
        folderDiv.css("top", folder.position.top)
        folderDiv.css("left", folder.position.left);
    }

    $(`<p class="folderName">${newFolder.name}</p>`).appendTo(folderDiv);

    newFolder.initEvent(folderDiv, tasks, folders);
    return newFolder;
}

async function getData(){
    const rawResponse = await fetch('http://localhost:3000', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    const content = await rawResponse.json();
    return content;
}

function getContrast(hexcolor){
    var r = parseInt(hexcolor.substring(1,3),16);
    var g = parseInt(hexcolor.substring(3,5),16);
    var b = parseInt(hexcolor.substring(5,7),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function *idGenerator(startingValue = 0){
    while(true){
        yield startingValue;
        startingValue++;
    }
}

export {idGenerator, getContrast, getData, createFolderByJson, createTaskByJson};