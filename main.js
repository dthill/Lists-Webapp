var listId = 0;

//handlebars like takes a HTML element and an object with each key to replace text
function toTemplate(htmlTemplate, dataObject){
  htmlTemplate = htmlTemplate.innerHTML;
  Object.keys(dataObject).forEach(function(dataItem){
    itemRegExp = new RegExp("{{\\s*" + dataItem + "\\s*}}", "igm");
    htmlTemplate = htmlTemplate.replace(itemRegExp, dataObject[dataItem]);
  });
  return htmlTemplate;
}

//saves to local storage, entire div as HTML with all the list and listId
function saveToLocal(){
  var listsToSave = document.getElementById("allLists").innerHTML
  localStorage.setItem("savedLists", listsToSave);
  localStorage.setItem("listId", listId);
}

//updates the count for all the lists, saves all the lists to local storage
function updateCount(){{}
    //loop through all the lists
    Array.from(document.getElementById("allLists").children).forEach(function(individualList){
      var itemsToPack = 0;
      //loop through all li items in each list
      Array.from(individualList.children[2].children).forEach(function(listItem){
        if(!listItem.classList.contains("packed")){
          itemsToPack++;
        }
      });
      //update items left on the list text and make buttons visible invisble if there are items
      var itemText = itemsToPack === 1 ? itemsToPack + " item" : itemsToPack + " items";
      individualList.children[3].children[0].children[0].innerText = itemText;
      if(individualList.children[2].children.length){
        individualList.children[3].classList.remove("hide");
      } else {
        individualList.children[3].classList.remove("show");
      }
    });
    saveToLocal();
}


function createNewList(){
  listId++;
  var listData = {listId: listId};
  document.getElementById("allLists").insertAdjacentHTML("afterbegin", toTemplate(document.getElementById("newList"), listData));
  updateCount();
}


document.getElementById("addNewList").addEventListener("click", function(event){
  event.preventDefault();
  createNewList(listId);
});

document.getElementById("allLists").addEventListener("click", function(event){
  //remove list
  if(event.target.classList.contains("remove") && event.target.parentNode.classList.contains("listTitle")){
      event.preventDefault();
      event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
      updateCount();
  //rename list
  } else if(event.target.classList.contains("rename") && event.target.parentNode.classList.contains("listTitle")){
    event.preventDefault();
    var data = {itemText: event.target.parentNode.children[0].innerHTML};
    event.target.outerHTML = toTemplate(document.getElementById("editorPackingListTemp"), data);
    updateCount();
  //remove item from a list
  } else if(event.target.classList.contains("removeLi")){
    event.preventDefault();
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    updateCount();
  //edit item in a list
  } else if(event.target.classList.contains("editLi")){
    event.preventDefault();
    var data = {itemText: event.target.parentNode.children[1].innerText};
    event.target.parentNode.innerHTML = toTemplate(document.getElementById("editorPackingListTemp"), data);
    updateCount();
  //delete all items from list but keep list
  } else if(event.target.classList.contains("deleteAll")){
    event.target.parentNode.parentNode.children[2].innerHTML = "";
    updateCount();
  //clear all ticked items from list
  } else if(event.target.classList.contains("clearAll")){
    Array.from(event.target.parentNode.parentNode.children[2].children).forEach(function(item){
      if(item.classList.contains("packed")){
          item.parentNode.removeChild(item);
      }
    });
    updateCount();
  }
});

document.getElementById("allLists").addEventListener("submit", function(event){
  //sumbit renaming of list title
  if(event.target.classList.contains("editor") && event.target.parentNode.classList.contains("listTitle")){
    event.preventDefault();
    if(event.target.children[0].value !== ""){
      event.target.parentNode.children[0].innerHTML = event.target.children[0].value;
      event.target.outerHTML = "<a href='#' class='rename'>Rename List</a>";
    }
  //add item to list
  } else if(event.target.classList.contains("packingForm")){
    event.preventDefault();
    var data = {itemText: event.target.children[0].value};
    if(data.itemText !== ""){
      event.target.parentNode.children[2].insertAdjacentHTML("beforeend", toTemplate(document.getElementById("packingListTemp"), data));
      event.target.children[0].value = "";
      updateCount();
    }
  //save edited item to list
  } else if(event.target.classList.contains("editor") && event.target.parentNode.parentNode.classList. contains("packingList")){
    var data = {itemText: event.target.children[0].value};
      if(data.itemText !== ""){
        event.target.parentNode.parentNode.innerHTML = toTemplate(document.getElementById("packingListTemp"), data);
        updateCount();
      }
  }
  
});
  
document.getElementById("allLists").addEventListener("change", function(event){
    //change checked status for item in list
    if(event.target = "input[type='checkbox']"){
      event.target.parentNode.classList.toggle("packed");
      updateCount();
    }
});


//load saved list from local storage
window.addEventListener("load", function(){
  if(localStorage.length !== 0){
    document.getElementById("allLists").innerHTML = localStorage.getItem("savedLists");
    listId = localStorage.getItem("listId");
  } else {
    createNewList();
  }
})


