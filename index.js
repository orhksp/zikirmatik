document.addEventListener('DOMContentLoaded', () => {
    const counterDisplay = document.getElementById('counter');
    const incrementButton = document.getElementById('increment-btn');
    const decrementButton = document.getElementById('decrement-btn');
    const resetButton = document.getElementById('reset-btn');
    const registerButton = document.getElementById('register-btn');
    const loginButton = document.getElementById('login-btn');
    const logoutButton = document.getElementById('logout-btn');
    const addDuaButton = document.getElementById('add-dua-btn');
    const duaSelect = document.getElementById('dua-select');
    const newDuaInput = document.getElementById('new-dua');
    const duaTitleInput = document.getElementById('dua-title');
    const selectedDuaDisplay = document.getElementById('selected-dua');
    const userInfo = document.getElementById('user-info');
    const userNameDisplay = document.getElementById('user-name');
    const duaList = document.getElementById('dua-list');

    let counter = 0;
    let currentUser = null;

    registerButton.addEventListener('click', () => {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(user => user.email === email)) {
            alert('User already exists');
            return;
        }

        users.push({ firstName, lastName, email, password, duas: [] });
        localStorage.setItem('users', JSON.stringify(users));
        alert('User registered successfully');
    });

    loginButton.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            alert('Invalid email or password');
            return;
        }

        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('zikirmatik-container').style.display = 'block';
        userInfo.classList.remove('d-none');
        userNameDisplay.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        loadDuas();
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('zikirmatik-container').style.display = 'none';
        userInfo.classList.add('d-none');
    });

    incrementButton.addEventListener('click', () => {
        counter++;
        counterDisplay.textContent = counter;
        updateDuaCount();
    });

    decrementButton.addEventListener('click', () => {
        if (counter > 0) {
            counter--;
            counterDisplay.textContent = counter;
            updateDuaCount();
        }
    });

    resetButton.addEventListener('click', () => {
        counter = 0;
        counterDisplay.textContent = counter;
        updateDuaCount();
    });

    addDuaButton.addEventListener('click', () => {
        const title = duaTitleInput.value;
        const text = newDuaInput.value;
        if (title && text) {
            currentUser.duas.push({ title, text, count: 0 });
            localStorage.setItem('users', JSON.stringify(JSON.parse(localStorage.getItem('users')).map(user => user.email === currentUser.email ? currentUser : user)));
            duaTitleInput.value = '';
            newDuaInput.value = '';
            loadDuas();
        }
    });

    duaSelect.addEventListener('change', () => {
        const selectedDua = duaSelect.options[duaSelect.selectedIndex];
        const dua = currentUser.duas[selectedDua.value];
        counter = dua.count;
        counterDisplay.textContent = counter;
        selectedDuaDisplay.textContent = dua.text;
    });

    function loadDuas() {
        duaSelect.innerHTML = '';
        duaList.innerHTML = '';
        currentUser.duas.forEach((dua, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = dua.title;
            option.setAttribute('data-count', dua.count);
            duaSelect.appendChild(option);

            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <span>${dua.title}</span>
                <div class="btn-group">
                    <button class="btn btn-sm btn-warning edit-dua-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-dua-btn" data-index="${index}">Delete</button>
                </div>
            `;
            duaList.appendChild(listItem);
        });

        if (currentUser.duas.length === 1) {
            const singleDua = currentUser.duas[0];
            duaSelect.selectedIndex = 0;
            selectedDuaDisplay.textContent = singleDua.text;
            counter = singleDua.count;
            counterDisplay.textContent = counter;
        }

        document.querySelectorAll('.edit-dua-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const newTitle = prompt('Edit Dua Title:', currentUser.duas[index].title);
                const newText = prompt('Edit Dua Text:', currentUser.duas[index].text);
                if (newTitle !== null && newText !== null) {
                    currentUser.duas[index].title = newTitle;
                    currentUser.duas[index].text = newText;
                    localStorage.setItem('users', JSON.stringify(JSON.parse(localStorage.getItem('users')).map(user => user.email === currentUser.email ? currentUser : user)));
                    loadDuas();
                }
            });
        });

        document.querySelectorAll('.delete-dua-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                currentUser.duas.splice(index, 1);
                localStorage.setItem('users', JSON.stringify(JSON.parse(localStorage.getItem('users')).map(user => user.email === currentUser.email ? currentUser : user)));
                loadDuas();
                if (duaSelect.selectedIndex === index) {
                    selectedDuaDisplay.textContent = '';
                    counter = 0;
                    counterDisplay.textContent = counter;
                }
            });
        });
    }

    function updateDuaCount() {
        const selectedDua = duaSelect.options[duaSelect.selectedIndex];
        if (selectedDua) {
            const index = selectedDua.value;
            currentUser.duas[index].count = counter;
            localStorage.setItem('users', JSON.stringify(JSON.parse(localStorage.getItem('users')).map(user => user.email === currentUser.email ? currentUser : user)));
        }
    }

    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
        currentUser = storedUser;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('zikirmatik-container').style.display = 'block';
        userInfo.classList.remove('d-none');
        userNameDisplay.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        loadDuas();
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('zikirmatik-container').style.display = 'none';
        userInfo.classList.add('d-none');
    }
});