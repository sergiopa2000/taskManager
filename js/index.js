import {Folder} from "./folder.js"
import {Task} from "./task.js"
import * as utils from "./utils.js" 

const folderIdGenerator = utils.idGenerator();
const taskIdGenerator = utils.idGenerator();
const taskContainer = $("#task-container");
let folders = [];
let tasks = [];

$(window).on('beforeunload', () =>{
    for (const folder of folders) {
        let domFolder = $(`#${folder.id}`);
        folder.updatePosition(domFolder.position());
    }
});

$(window).on('load', () =>{
    utils.getData().then((data) => {
        console.log(data);
        let dataFolders = data.folders;
        let dataTasks = data.tasks;
        if(data.folders.length > 0){
            for (const folder of dataFolders) {
                let newFolder = utils.createFolderByJson(folder, folders, tasks);
                folders.push(newFolder);
                folderIdGenerator.next();
            }
        }
        if(data.tasks.length > 0){
            for (const task of dataTasks) {
                let newTask = utils.createTaskByJson(task, folders);
                tasks.push(newTask);
                taskIdGenerator.next();
            }
        }
    });
});

$( "#createTask" ).on('click', (e) =>{
    let title = "New Task";
    if($("#taskTitle").val() != ""){
        title = $("#taskTitle").val();
    }
    let task = new Task({
        id: "task" + taskIdGenerator.next().value,
        title: title,
        color: $("#taskColor").val(),
        content: $("#taskContent").val(),
        idFolder: null,
    });
    tasks.push(task);

    let taskDiv = $('<div/>',{
        id: task.id,
        class: 'task'
    }).appendTo('#task-container');
    taskDiv.css("backgroundColor", task.color);
    taskDiv.css("color", utils.getContrast(task.color));
    taskDiv.data("inFolder", false)

    $(`<p class="taskTitle">${task.title}</p>`).appendTo(taskDiv);
    $(`<p class="taskContent">${task.content}</p>`).appendTo(taskDiv);

    task.initEvent(taskDiv);
    task.create();
});

$( "#createFolder" ).on('click', (e) =>{
    let name = "New Folder";
    if($("#taskTitle").val() != ""){
        name = $("#folderName").val();
    }
    let folder = new Folder({
        id: "folder" + folderIdGenerator.next().value,
        name: name,
        color: $("#folderColor").val(),
        tasks: []
    });
    folders.push(folder);

    let folderDiv = $('<div/>',{
        id: folder.id,
        class: 'folder'
    }).appendTo('#task-container');
    folderDiv.css("backgroundColor", folder.color);
    folderDiv.css("color", utils.getContrast(folder.color));

    $(`<p class="folderName">${folder.name}</p>`).appendTo(folderDiv);

    folder.initEvent(folderDiv, tasks, folders);
    folder.create();
});

taskContainer.droppable({
    accept: ".inFolder",
    drop: function( event, ui ) {
        let item = ui.draggable;
        let taskObject = tasks.find((task) => task.id == item.attr("id"));
        let previousFolder = folders.find((folder) => folder.id == ui.draggable.parent().attr("id"));
        console.log(previousFolder);
        // Eliminamos la task de su anterior carpeta si estaba en una
        if(previousFolder){
            console.log(previousFolder.tasks);
            previousFolder.tasks.splice(previousFolder.tasks.indexOf(taskObject), 1);
            previousFolder.update();
        }

        taskObject.idFolder = null;
        taskObject.update();

        item.addClass("global");
        item.removeClass("inFolder");
        item.fadeOut(function() {
            item.appendTo(event.target).fadeIn(function() {
                item.animate({ opacity: 1 })
              });
        })
    }
});
