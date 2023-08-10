import { app, database, storage, auth } from './firebase.mjs'
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, query, where, addDoc, doc, deleteDoc, updateDoc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getDownloadURL, ref, deleteObject, uploadBytes } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";




let myEmail;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        myEmail = user.email
        console.log(myEmail);
        const q1 = query(collection(database, "users"), where("email", "==", myEmail));

        const querySnapshot1 = await getDocs(q1);
        querySnapshot1.forEach((doc) => {
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

        });

        let id = localStorage.getItem('id')
        const docRef = doc(database, "Admin-card-Add", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            getDownloadURL(ref(storage, id))
                .then((url) => {
                    console.log(url);
                    let shoping = document.getElementById('shoping');
                    shoping.innerHTML = `
                    <div class="img-one">
                            <img src="${url}" alt="">
                            <div class="img-two">
                                <h6>Rose Printed Hoodie</h6>
                                  <p>Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at</p>
                                  <select id='qty' name='1' onchange="select()">
                                  <option selected value='1'>1</option>
                                  <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                    <option value='6'>6</option>
                                    <option value='7'>7</option>
                                    <option value='8'>8</option>
                                    <option value='9'>9</option>
                                    <option value='10'>10</option>
                                    <option value='11'>11</option>
                                    <option value='12'>12</option>
                                    <option value='13'>13</option>
                                </select>
                                  
                                    </div>
                                    </div>
                                    `
                    show(docSnap.data())

                    window.select = () => {
                        let number_dd = document.getElementById('qty');
                        let pr = +docSnap.data().price * number_dd.value
                        console.log(pr);
                        const selectedValue = number_dd.value;
                        console.log('Selected Value:', selectedValue);
                        let number = selectedValue * docSnap.data().price;
                        console.log(number, 'price');

                        let price = number * .18;
                        console.log(price);
                        let total = +number + price;
                        console.log(total);
                        let shoping1 = document.getElementById('shoping1').innerHTML = `
    <h4>Order summary</h4>
    <div class="total">
    <p>Subtotal</p>
    <p>₹ ${number}</p>
    </div>
    <div class="total">
    <p>Tax(18%)</p>
    <p>₹ ${price}</p>
    </div>
    <div class="total">
    <p>Order total</p>
    <p>₹ ${total}</p>
</div>
<button onclick='checkout("${localStorage.getItem('id')}")'>CheckOut</button>
`
                        localStorage.setItem('quantity', selectedValue);
                        localStorage.setItem('number', number);
                        localStorage.setItem('price', price);
                        localStorage.setItem('total', total);
                    }
                    select()
                })
                .catch((error) => {
                    console.log(error);
                });


            // CheckOut
            async function checkout(e) {
                console.log(e);
                const docRef = doc(database, "Admin-card-Add", e);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                   
                        location.href = './checkout.html'
                   
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
                let number_dd = document.getElementById('number-dd');
                console.log(number_dd.value);
                console.log(localStorage.getItem("number"));
                console.log(localStorage.getItem('price'));
                console.log(localStorage.getItem('total'));
                console.log(localStorage.getItem('quantity'));
                console.log(localStorage.getItem('quan'));
                localStorage.setItem('id', e);
            }
            window.checkout = checkout


        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

    } else {
        // User is signed out
        // ...
    }
});


function show(doc) {
    console.log(doc);
    let number_dd = document.getElementById('qty').value;
    console.log(number_dd);
    let price = number_dd * .18;
    console.log(price);
    let total = +doc.price + price;
    console.log(total);
    document.getElementById('shoping1').innerHTML = `
        <h4>Order summary</h4>
        <div class="total">
        <p>Subtotal</p>
         <p>₹${price} </p>
            </div>
            <div class="total">
            <p>Tax(18%)</p>
            <p>₹ 0</p>
            </div>
        <div class="total">
        <p>Order total</p>
         <p>₹ 0</p>
         </div>
         <button onclick='checkout("${localStorage.getItem('id')}")'>CheckOut</button>
         `
    localStorage.setItem('number', doc.number);
    localStorage.setItem('price', doc.price);
    localStorage.setItem('total', doc.total);
    localStorage.setItem('quan', number_dd.value)
    //  select(doc)
}




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
//     alert('Welcome to user Page');
//     location.href = './user.html'
// }
// window.userPage = userPage


window.logout = logout
window.adminPage = adminPage

// https://next-shop-gilt.vercel.app/?fbclid=IwAR2S-8oY9BtMpD0bwdY9wx1KIri-sml6KiuF_ECadAQU_i9QVlvhaG12fZ0