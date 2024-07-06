const addNote = document.querySelector('.notes__add');
let title = document.querySelector('.notes__title');
let txt = document.querySelector('.notes__body');
let notesList = document.querySelector('.notes__list');
let menu = document.querySelector('.menu');
let notesSideBar = document.querySelector('.notes__sidebar');
let titlesSet = new Set();

const addText = () => {
   
    // Get the title and body from input fields
    let newTitle = title.value.trim();
    let newBody = txt.value.trim();

    //Checking if title is empty or not
    if(newTitle === ''){
        alert("Please add title first");
        return;
    }
   
    // Check if the title already exists
    if (titlesSet.has(newTitle)) {
        alert("Title already exists");
        return;
    }

    //Finding current date and time
    let date = new Date();
    let dateString = date.toString().replace(/GMT.*/, '');

    // Create a new note element
    let newNote = document.createElement('div');
    newNote.innerHTML = `
        <div class="notes__small-title">${newTitle} 
        <div>
        <img title="Save changes" class="edit" src="icons/save-line.svg" alt="">  
        <img class="dlt" src="icons/delete-bin-6-fill.svg" alt="">
        </div>
        </div>
        <div class="notes__small-body">${newBody}</div>
        <div class="notes__small-updated">${dateString}</div>
    `;
    newNote.className = 'notes__list-item notes__list-item--selected';
    notesList.append(newNote);

    // Add the new title to the set
    titlesSet.add(newTitle);

    // Clear the input fields
    title.value = '';
    txt.value = '';
    updateStorage();
}

notesList.addEventListener('click', (e) => {
    let clickedElement = e.target;
    while (clickedElement) {
        if (clickedElement.classList && clickedElement.classList.contains('notes__list-item')) {
            // Found the 'notes__list-item' element
        
            // Find the title and body elements within the clicked 'notes__list-item'
            const titleElement = clickedElement.querySelector('.notes__small-title');
            const bodyElement = clickedElement.querySelector('.notes__small-body');
           
            // Update the title and body with the text content of input and textarea
            if (titleElement && title) {
                title.value = titleElement.textContent;
            }
            if (bodyElement && txt) {
                // Update the textarea value with the entire body content
                txt.value = bodyElement.textContent; // Change this line
            }
            updateStorage();
            // Stop traversing up the DOM hierarchy
            return;
        }
        clickedElement = clickedElement.parentNode;
        
    }
   
});

const deleteNote = (e) => {
    if(e.target.className === 'dlt'){
        e.target.parentNode.parentNode.parentNode.remove();
        title.value = '';
        txt.value = '';
        updateStorage();
    }
}

const saveChanges = () =>{
    let newBod = txt.value;
    let date = new Date();
    let dateString = date.toString().replace(/GMT.*/, '');
    notesList.addEventListener('click',(e)=>{
        let clickElem = e.target;
        while(clickElem){
            if(clickElem.classList && clickElem.classList.contains('notes__list-item')){    
                if(e.target.className === 'edit'){
                    let clickedBody = clickElem.querySelector('.notes__small-body');
                    let clickedDate = clickElem.querySelector('.notes__small-updated');
                    clickedBody.textContent = newBod;
                    txt.value = newBod;
                    clickedDate.textContent = dateString;
                }
            }
            clickElem = clickElem.parentNode;
        }
   })
}

//This is simple way of updating and putting data in local storage
// const updateStorage = ()=>{
//     localStorage.setItem('notes',notesList.innerHTML);
// }

// const showNotes = () =>{
//     notesList.innerHTML = localStorage.getItem('notes');
// }

const updateStorage = () => {
    // Create an array to store the notes data
    const notesData = [];

    // Iterate over each note item
    document.querySelectorAll('.notes__list-item').forEach(note => {
        // Extract data from the note item
        const title = note.querySelector('.notes__small-title').textContent;
        const body = note.querySelector('.notes__small-body').textContent;
        const updated = note.querySelector('.notes__small-updated').textContent;
       
        // Add the note data to the array
        notesData.push({title, body, updated});
        
    });

    // Store the notes data in local storage as JSON
    localStorage.setItem('notes', JSON.stringify(notesData));
}

const showNotes = () => {
    // Retrieve the notes data from local storage
    const notesData = JSON.parse(localStorage.getItem('notes'));

    // Check if there are any notes data
    if (notesData) {

        notesData.sort((a,b)=>{ 
            return new Date(b.updated) - new Date(a.updated);
        })

        // Clear the existing notes list
        notesList.innerHTML = '';

        // Iterate over each note data and create HTML elements
        notesData.forEach(data => {
            const newNote = document.createElement('div');
            newNote.innerHTML = `
                <div class="notes__small-title">${data.title}
                    <div>
                        <img title="Save changes" class="edit" src="icons/save-line.svg" alt="">
                        <img class="dlt" src="icons/delete-bin-6-fill.svg" alt="">
                    </div>
                </div>
                <div class="notes__small-body">${data.body}</div>
                <div class="notes__small-updated">${data.updated}</div>
            `;
            newNote.className = 'notes__list-item notes__list-item--selected';
            notesList.appendChild(newNote);
        });

        // Reattach event listeners for delete and save icons
        notesList.querySelectorAll('.dlt').forEach(icon => {
            icon.addEventListener('click', deleteNote);
        });

        notesList.querySelectorAll('.edit').forEach(icon => {
            icon.addEventListener('click', saveChanges);
        });
    }
}

showNotes();

let flag = true;
const showMenu = ()=>{
    if(flag === true){
        notesSideBar.style.display = 'block';
        flag = false;
    }else{
        notesSideBar.style.display = 'none';
        flag = true;
    }
   
}

addNote.addEventListener('click',addText);
notesList.addEventListener('click',deleteNote);
txt.addEventListener('input',saveChanges);
menu.addEventListener('click',showMenu);






