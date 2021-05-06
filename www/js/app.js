var $$ = Dom7;

var app = new Framework7({
  root: '#app', // App Root Element
  name: 'framework7-core-tab-view', // App Name
  theme: 'auto', // Automatic Theme Detection

  view: {
    stackPages: true, // For Navigation Between Multi-level Pages
  },
  data: function () {
    return {
      // App Root Data
    };
  },
  methods: {
    // App Root Methods
  },
  routes: routes, // App Routes
});

const threadsList = document.querySelector('.threads');
const signedInLinks = document.querySelectorAll('.signed-in');
const signedOutLinks = document.querySelectorAll('.signed-out');

const setUpUI = (user) => {
  if (user) {
    // Toggle UI Elements
    signedInLinks.forEach(item => item.style.display = 'inline');
    signedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // Toggle UI Elements
    signedInLinks.forEach(item => item.style.display = 'none');
    signedOutLinks.forEach(item => item.style.display = 'inline');
  }
}

// Create New Thread
const newThread = () => {
  const createThreadForm = document.querySelector('#create-thread-form');
  const createThreadBtn = document.querySelector('#create-thread');

  createThreadBtn.addEventListener('click', () => {
    //TO DO: picture
    if (app.input.validate('#title') && app.input.validate('#description')) {
      db.collection('threads').add({
        title: createThreadForm['title'].value,
        description: createThreadForm['description'].value,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        app.dialog.close();
        createThreadForm.reset();
      });
    }
  });
}

// Setting Up The Threads
const setUpThreads = (data) => {
  let html = '';
  data.forEach(doc => {
    const thread = doc.data();
    const li = `
      <li class="swipeout">
        <div class="swipeout-content">
          <a href="/thread/${doc.id}/" data-thread-id="${doc.id}" class="item-link item-content thread-details">
            <div class="item-media"><img src="http://placehold.jp/40x40.png" width="44"/></div>
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">${thread.title}</div>
              </div>
              <div class="item-subtitle">${thread.description}</div>
            </div>
          </a>
        </div>
        <div class="swipeout-actions-right">
          <a href="#" class="delete-thread-dialog">Delete</a>
        </div>
      </li>  
    `;
    html += li;
  });
  threadsList.innerHTML = html;
}

// Setting Up The Thread Details
const setUpThreadDetails = (id) => {
  db.collection('threads')
    .where(firebase.firestore.FieldPath.documentId(), "==", id)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const thread = doc.data();
        document.getElementById("thread-title").innerText = thread.title;
        document.getElementById("thread-description").innerText = thread.description;
      });
    });
}

// Event Listeners
// Get Data for Thread Details Page
$$(document).on('click', '.thread-details', function () {
  const id = $$(this).data('thread-id');
  setUpThreadDetails(id);
})

// Reload Home Page
$$(document).on('click', '.icon-back', function () {
  $$(document).on('page:init', '.page[data-name="home"]', function () {
    window.location.reload();
  });
});

// Pop Up With Swipe To Close
const loginSwipeToClosePopup = app.popup.create({
  el: '.login-popup',
  swipeToClose: true,
});

// Dialogs 
// Open a Dialog For Adding a New Thread
$$('.new-thread-dialog').on('click', function () {
  app.dialog.create({
    content: ' <div class="page-content login-screen-content"> <div class="block-title">New Topic</div> <form class="list" id="create-thread-form"> <div class="list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <input type="text" id="title" name="title" placeholder="Thread Title" required validate/> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Description" required validate></textarea> </div> </div> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="create-thread" href="#">Create Thread</a> <a class="button" id="cancel-thread" href="#">Cancel</a> </div> </form> </div>',
    cssClass: 'dialog'
  }).open();

  newThread();
});

// Close The Thread Dialog
$$(document).on('click', '#cancel-thread', function () {
  app.dialog.close();
});

// Open a Dialog For Adding a New Comment
$$(document).on('click', '.new-comment-dialog', function () {
  app.dialog.create({
    content: '<div class="page-content login-screen-content"> <form class="list"> <div class="list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea name="description" placeholder="Write your comment here"></textarea> </div> </div> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button popup-close submit-comment-dialog" href="#">Submit</a>  <a class="button submit-comment-dialog" href="#">Cancel</a></div> </form> </div>',
    cssClass: 'dialog'
  }).open();
});

// After Submission Close Comment Dialog
$$(document).on('click', '.submit-comment-dialog', function () {
  app.dialog.close();
});

// Confirmation Dialog For Deleting a Thread
$$(document).on('click', '.delete-thread-dialog', function () {
  app.dialog.confirm(' Are you sure you want to delete the thread?', '', function () {
    app.dialog.alert('Thread Deleted', '');
  });
});

// Confirmation Dialog For Deleting a Comment
$$(document).on('click', '.delete-comment-dialog', function () {
  app.dialog.confirm(' Are you sure you want to delete the comment?', '', function () {
    app.dialog.alert('Comment Deleted', '');
  });
});