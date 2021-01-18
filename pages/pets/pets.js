window.addEventListener("DOMContentLoaded", () => {
    let pets = [];

    const navigationItemsEmpty = document.querySelectorAll('.navigation__item--empty a');

    for (const item of navigationItemsEmpty) {
        item.addEventListener("click", (event) => {
            event.preventDefault();
        });
    }

    const hamburger = document.querySelector("#hamburger");
    const header = document.querySelector(".main-header");

    hamburger.addEventListener("click", (event) => {
        event.stopPropagation();
        header.classList.toggle("main-header--active");
        toggleBodyScrolling();
        toggleHeaderHeight();
    });

    const navWrapper = document.querySelector(".nav-wrapper");

    navWrapper.addEventListener("click", function(event) {
        if (event.target !== this) {
            return;
        }
        event.stopPropagation();
        header.classList.toggle("main-header--active");
    });

    header.addEventListener("click", (event) => {
        event.stopPropagation();
        const isHeaderShown = event.target.classList.contains("main-header--active");
        return isHeaderShown ? header.classList.toggle("main-header--active") : null;
    });

    const getPets = async () => {
        const petsJSON = await fetch('https://rolling-scopes-school.github.io/babkinevgeny-JS2020Q3/shelter/pets.json');
        const petsData = await petsJSON.json();
        return petsData;
    };

    // pagination and slider

    const createPet = (slideInfo) => {
        const sliderItem = document.createElement("li");
        sliderItem.classList.add("slider__item");

        const img = document.createElement("img");
        img.setAttribute("src", `../../assets/images/${slideInfo.name.toLowerCase()}.png`);
        sliderItem.appendChild(img);

        const title = document.createElement("h4");
        title.classList.add("title");
        title.textContent = slideInfo.name;
        sliderItem.appendChild(title);

        const btn = document.createElement("button");
        btn.classList.add("btn", "btn--white");
        btn.textContent = "Learn more";
        sliderItem.appendChild(btn);

        sliderItem.addEventListener('click', () => {
            const currentPetInfo = pets.find(pet => pet.name === slideInfo.name);
            fillPopup(currentPetInfo);
            // const popup = document.querySelector('#popup');
            // popup.classList.add('popup--active')
            togglePopup();
            // popup.style.visibility = 'visible';
            // popup.style.opacity = '1';
            toggleBodyScrolling();
        });

        return sliderItem;
    }

    const sort863 = (list) => {
        let length = list.length;

        for (let i = 0; i < (length / 6); i++) {
            const stepList = list.slice(i * 6, (i * 6) + 6) // разбиваем на шестерки

            for (let j = 0; j < 6; j++) {
                const duplicate = stepList.find((item, index) => {
                    return item.name === stepList.name && index !== j
                });

                if (duplicate !== undefined) {
                    const indexOfDuplicate = (i * 6) + j; // находим индекс дубликата
                    const which8ContainsDuplicate = Math.trunc(indexOfDuplicate / 8); // находим в какой восьмерке он содержится

                    const elem = list.splice(indexOfDuplicate, 1)[0]; // вырезаем дубликат
                    list.splice(which8ContainsDuplicate * 8, 0, elem); // перемещаем дубликат в начало восьмерки, в которой он содержится

                    i -= 2; // откатываемся на 2 шага назад
                    break;
                }
            }
        }

        return list;
    }

    const fillSlider = (list) => {
        const sliderNavigation = document.querySelector("#slider .slider__navigation");
        const bodyWidth = document.querySelector('body').offsetWidth;
        const petsPerSlide = bodyWidth >= 1280 ? 8 : bodyWidth >= 768 ? 6 : 3;
        let listCounter = 1;
        while (list.length > 0) {
            const sliderList = document.createElement('ul');
            sliderList.classList.add('slider__list');

            if (listCounter === 1) {
                sliderList.classList.add('slider__list--active');
            }

            sliderList.setAttribute('data-slider-list-number', `${listCounter}`);
            
            for (let i = 0; i < petsPerSlide; i++) {
                const petItem = createPet(list[i]);
                sliderList.appendChild(petItem);
            }

            listCounter++;

            sliderNavigation.before(sliderList);
            list.splice(0, petsPerSlide);
        }
    }

    const createPetsList = async () => {
        if (pets.length === 0) {
            pets = await getPets();
        }

        let newPets = [];

        for (let i = 0; i < 6; i++) {
            const petsCopy = [...pets];
            for (let j = 0; j < pets.length; j++) {
                const randomIndex = Math.floor(Math.random() * petsCopy.length);
                const pet = petsCopy[randomIndex];
                petsCopy.splice(randomIndex, 1);
                newPets.push(pet);
            }
        }


        const shuffledPets = sort863(newPets);

        fillSlider(shuffledPets);
    };

    createPetsList();

    // pagination

    const toggleDisablingBtn = (btn, disable = false) => {
        if (disable) {
            btn.setAttribute("disabled", true)
        } else {
            btn.removeAttribute("disabled", false)
        }
    }

    const btnNext = document.querySelector('#btn-next');

    btnNext.addEventListener("click", () => {
        const btnNumber = document.querySelector('#btn-number');
        const prevPage = document.querySelector('.slider__list--active');
        const prevPageNumber = +prevPage.getAttribute('data-slider-list-number');
        const pages = document.querySelectorAll('.slider__list').length;
        
        if (prevPageNumber === pages) {
            return;
        }

        if (prevPageNumber === 1 && pages > 1) {
            const prevBtn = document.querySelector('#btn-prev');
            const toStartBtn = document.querySelector('#btn-to-start');
            toggleDisablingBtn(prevBtn);
            toggleDisablingBtn(toStartBtn);
        }

        const nextPageNumber = prevPageNumber + 1;

        if (nextPageNumber === pages) {
            const nextBtn = document.querySelector('#btn-next');
            const toEndBtn = document.querySelector('#btn-to-end');
            toggleDisablingBtn(nextBtn, true);
            toggleDisablingBtn(toEndBtn, true);
        }

        const nextPage =  document.querySelector(`.slider__list[data-slider-list-number="${nextPageNumber}"]`);
        
        prevPage.classList.remove('slider__list--active');
        nextPage.classList.add('slider__list--active');

        btnNumber.textContent = nextPageNumber;
    });

    const btnPrev = document.querySelector('#btn-prev');

    btnPrev.addEventListener("click", () => {
        const btnNumber = document.querySelector('#btn-number');
        const prevPage = document.querySelector('.slider__list--active');
        const prevPageNumber = +prevPage.getAttribute('data-slider-list-number');
        const pages = document.querySelectorAll('.slider__list').length;
        const currentPageNumber = prevPageNumber - 1;

        if (currentPageNumber === 1) {
            const prevBtn = document.querySelector('#btn-prev');
            const toStartBtn = document.querySelector('#btn-to-start');
            toggleDisablingBtn(prevBtn, true);
            toggleDisablingBtn(toStartBtn, true);
        }

        if (currentPageNumber < pages ) {
            const nextBtn = document.querySelector('#btn-next');
            const toEndBtn = document.querySelector('#btn-to-end');
            toggleDisablingBtn(nextBtn);
            toggleDisablingBtn(toEndBtn);
        }

        const currentPage =  document.querySelector(`.slider__list[data-slider-list-number="${currentPageNumber}"]`);
        
        prevPage.classList.remove('slider__list--active');
        currentPage.classList.add('slider__list--active');

        btnNumber.textContent = currentPageNumber;
    });

    const btnToStart = document.querySelector('#btn-to-start');

    btnToStart.addEventListener('click', function (event) {
        toggleDisablingBtn(event.target, true);
        const btnNumber = document.querySelector('#btn-number');
        btnNumber.textContent = 1;

        const btnPrev = document.querySelector('#btn-prev');
        toggleDisablingBtn(btnPrev, true);

        const btnNext = document.querySelector('#btn-next');
        const btnToEnd = document.querySelector('#btn-to-end');

        toggleDisablingBtn(btnNext);
        toggleDisablingBtn(btnToEnd);

        const prevPage = document.querySelector('.slider__list--active');
        const currentPage =  document.querySelector('.slider__list[data-slider-list-number="1"]');
        
        prevPage.classList.remove('slider__list--active');
        currentPage.classList.add('slider__list--active');
    });

    const btnToEnd = document.querySelector('#btn-to-end');

    btnToEnd.addEventListener('click', function (event) {
        toggleDisablingBtn(event.target, true);
        const btnNumber = document.querySelector('#btn-number');
        const pages = document.querySelectorAll('.slider__list').length;
        btnNumber.textContent = pages;

        const btnNext = document.querySelector('#btn-next');
        toggleDisablingBtn(btnNext, true);

        const btnPrev = document.querySelector('#btn-prev');
        const btnToStart = document.querySelector('#btn-to-start');

        toggleDisablingBtn(btnPrev);
        toggleDisablingBtn(btnToStart);

        const prevPage = document.querySelector('.slider__list--active');
        const currentPage =  document.querySelector(`.slider__list[data-slider-list-number="${pages}"]`);
        
        prevPage.classList.remove('slider__list--active');
        currentPage.classList.add('slider__list--active');
    });

    //popup

    const fillPopup = petInfo => {
        const popupTitle = document.querySelector("#popup .title");
        popupTitle.textContent = petInfo.name;

        const popupDescription = document.querySelector("#popup .description");
        popupDescription.textContent = petInfo.description;

        const popupImg = document.querySelector("#popup img");
        popupImg.setAttribute("src", petInfo.img);

        const popupPetType = document.querySelector("#popup-pet-type");
        popupPetType.textContent = petInfo.type;

        const popupBreed = document.querySelector("#popup-breed");
        popupBreed.textContent = petInfo.breed;

        const popupAge = document.querySelector("#popup-age");
        popupAge.textContent = petInfo.age;

        const popupInoculations = document.querySelector("#popup-inoculations");
        popupInoculations.textContent = petInfo.inoculations.join(', ');

        const popupDiseases = document.querySelector("#popup-diseases");
        popupDiseases.textContent = petInfo.diseases.join(', ');

        const popupParasites = document.querySelector("#popup-parasites");
        popupParasites.textContent = petInfo.parasites.join(', ');
    }

    const popupCloseBtn = document.querySelector('#btn-close-popup');
    const popup = document.querySelector("#popup");

    popupCloseBtn.addEventListener("click", () => {
        console.log('click button')
        togglePopup();
        toggleBodyScrolling();
    });

    popup.addEventListener("click", function(event) {
        const isShown = popup.classList.contains('popup--active');
        
        if (!isShown) {
            return;
        }

        if (this !== event.target) {
            return;
        }

        togglePopup();
        toggleBodyScrolling();
    });

    const toggleBodyScrolling = () => {
        const body = document.querySelector('body');
        body.classList.toggle("modal-open");
    };

    const togglePopup = () => {
        const popup = document.querySelector('#popup');
        popup.classList.toggle("popup--active");
    }

    const toggleHeaderHeight = () => {

        if (header.classList.contains("main-header--active")) {
            header.style.background = 'transparent';
            header.style.height = '100%';
        } else {
            setTimeout(() => {
                header.style.height = 'inherit';
                header.style.background = 'white';
            }, 500);
        }
    }
});