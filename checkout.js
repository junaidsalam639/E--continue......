import { app, database, storage, auth } from './firebase.mjs'
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";






let myEmail;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        myEmail = user.email
        console.log(myEmail);
        const q1 = query(collection(database, "users"), where("email", "==", myEmail));

        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach(async (doc) => {
            console.log(doc.id, " => ", doc.data());

            let mt = document.getElementById('mt');
            mt.innerHTML = `
        <details class="dropdown">
        <summary role="button">
          <a class="button">${doc.data().name}!</a>
        </summary>
        <ul>
          <li><a href="#" onclick='logout()'>logout!</a></li>
          <li><a href="#" onclick='adminPage()'>Admin-Page</a></li>
          <li><a href="#">History</a></li>
      </ul>
    </details>`
            let id = localStorage.getItem('id');
            let number = localStorage.getItem('number');
            let price = localStorage.getItem('price');
            let total = localStorage.getItem('total');
            let quantity = localStorage.getItem('quantity');
            let quan = localStorage.getItem('quan');
            console.log(quan);
            console.log(id);
            console.log(number);
            console.log(price);
            console.log(total);
            console.log(quantity);
            console.log(doc.id);

            const q1 = query(collection(database, "users"), where("email", "==", myEmail));

            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach(async (doc) => {
                console.log(doc.id, " => ", doc.data().name);
                let name = document.getElementById('name').value = doc.data().name;
                
                getDownloadURL(ref(storage, localStorage.getItem('id')))
                    .then((url) => {
                       console.log(url);
                    })
                    .catch((error) => {
                        // Handle any errors
                    });

            })
        });




    } else {
        // User is signed out
        // ...
    }
});




// singOut Function
function logout() {
    signOut(auth).then(() => {
        alert('Singout successfully');
        location.reload()
        location.href = './index.html'
    }).catch((error) => {
        console.log(error);
    });
}

// admin page function
function adminPage() {
    let pro = prompt('Enter Your Admin Key');
    if (pro == '12345!@#$%') {
        alert('Your Key Is Match');
        location.href = './admin.html'
    }
    else {
        alert('Your Admin key Is Not Match');
    }
}


// user page function
// function userPage() {
//   alert('Welcome to user Page');
//   location.href = './user.html'
// }
// window.userPage = userPage
//   window.addToBag = addToBag


window.logout = logout
window.adminPage = adminPage