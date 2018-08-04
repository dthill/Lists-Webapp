var listId = 0;

function toTemplate(htmlTemplate, dataObject){
  htmlTemplate = htmlTemplate.innerHTML;
  Object.keys(dataObject).forEach(function(dataItem){
    itemRegExp = new RegExp("{{\\s*" + dataItem + "\\s*}}", "igm");
    htmlTemplate = htmlTemplate.replace(itemRegExp, dataObject[dataItem]);
  });
  return htmlTemplate;
}

function saveToLocal(){
  var listsToSave = document.getElementById("allLists").innerHTML
  localStorage.setItem("savedLists", listsToSave);
}


function createNewList(){
  listId++;
  var listData = {listId: listId};
  //create HTML
  document.getElementById("allLists").insertAdjacentHTML("afterbegin", toTemplate(document.getElementById("newList"), listData));

  function updateCount(){
    var itemsToPack = document.querySelectorAll("#packingList"+listData.listId+" li:not(.packed)").length;
    var itemText = itemsToPack === 1 ? itemsToPack + " item" : itemsToPack + " items";
    document.querySelector("#itemSummary"+listData.listId+" span").innerText = itemText;
    if(document.getElementById("packingList"+listData.listId).children.length > 0){
      document.getElementById("itemSummary"+listData.listId).style.opacity = "1";
    } else {
      document.getElementById("itemSummary"+listData.listId).style.opacity = "0";
    }
  }

  document.getElementById("listTitle"+listData.listId).addEventListener("click", function(event){
    if(event.target.classList.contains("remove")){
      event.preventDefault();
      this.parentNode.parentNode.removeChild(this.parentNode);
    }
    if(event.target.classList.contains("rename")){
      event.preventDefault();
      var data = {itemText: this.children[0].innerHTML, listId: listData.listId};
      this.children[1].innerHTML = toTemplate(document.getElementById("editorPackingListTemp"), data);
    }
  });

  document.getElementById("listTitle"+listData.listId).addEventListener("submit", function(event){
      event.preventDefault();
      this.children[0].innerHTML = event.target.children[0].value;
      event.target.parentNode.innerHTML = "Rename";
    });
  

  document.getElementById("packingForm"+listData.listId).addEventListener("submit" , function(event){
    event.preventDefault();
    var data = {itemText: document.getElementById("newItemDescription"+listData.listId).value};
    if(data.itemText !== ""){
      document.getElementById("packingList"+listData.listId).insertAdjacentHTML("beforeend", toTemplate(document.getElementById("packingListTemp"), data));
      document.getElementById("newItemDescription"+listData.listId).value = "";
      updateCount();
    }
  });

  document.getElementById("packingList"+listData.listId).addEventListener("change", function(event){
      if(event.target = "input[type='checkbox']"){
        event.target.parentNode.classList.toggle("packed");
        updateCount();
      }
  });

  document.getElementById("packingList"+listData.listId).addEventListener("click", function(event){
      if(event.target.classList.contains("remove")){
        event.preventDefault();
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        updateCount();
      }
      if(event.target.classList.contains("edit")){
        event.preventDefault();
        data = {itemText: event.target.parentNode.children[1].innerText, listId: listData.listId};
        event.target.parentNode.innerHTML = toTemplate(document.getElementById("editorPackingListTemp"), data);
      }
  });


  document.getElementById("packingList"+listData.listId).addEventListener("submit", function(event){
      event.preventDefault();
      var data = {itemText: document.getElementById("editor"+listData.listId).children[0].value};
      console.log(data)
      if(data.itemText !== ""){
        document.getElementById("editor"+listData.listId).parentNode.classList.remove("packed");
        document.getElementById("editor"+listData.listId).parentNode.innerHTML = toTemplate(document.getElementById("savePackingListTemp"), data);
        updateCount();
      }
  });

  document.getElementById("deleteItems"+listData.listId).addEventListener("click", function(){
      document.getElementById("packingList"+listData.listId).innerHTML = "";
      updateCount();
  });

  document.getElementById("clearPacked"+listData.listId).addEventListener("click", function(){
      Array.from(document.querySelectorAll("#noteList"+listData.listId+" .packed")).forEach(function(item){
          item.parentNode.removeChild(item);
      });
      updateCount();
  });
}


document.getElementById("addNewList").addEventListener("click", function(event){
  event.preventDefault();
  createNewList(listId);
});


/*
//load saved list from local storage
window.addEventListener("load", function(){
  document.getElementById("allLists").innerHTML = localStorage.getItem("savedLists");
  //updateCount()
})
*/

