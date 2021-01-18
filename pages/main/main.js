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

    //slider

    const prevSlide = document.querySelector("#prev-slide");
    const nextSlide = document.querySelector("#next-slide");

    const createSliderItem = (slideInfo) => {
        // if (pets.length === 0) {
        //     pets = await getPets();
        // }

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
            togglePopup();
        });

        return sliderItem;
    }

    const getPets = async () => {
        const pets = await fetch('https://rolling-scopes-school.github.io/babkinevgeny-JS2020Q3/shelter/pets.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                return data;
            })
            .catch(err => { throw err });
            
        return pets;
    };
   
    const getRandomPet = (max, exceptions = []) => {
        const min = 0;

        if (exceptions.length === 0) {
            return min + Math.floor((max - min) * Math.random());
        } else {
            let result = min + Math.floor((max - min) * Math.random());

            while (exceptions.includes(result)) {
                result = min + Math.floor((max - min) * Math.random());
            }

            return result;
        }
        
    }

    const getPetsPerSlide = () => {
        const bodyWidth = document.querySelector('body').offsetWidth;
        const petsPerSlide = bodyWidth >= 1280 ? 3 : bodyWidth >= 768 ? 2 : 1;
        return petsPerSlide
    }

    let oldSliderNumbers = [];

    const createSlide = async (direction) => {
        if (pets.length === 0) {
            pets = await getPets();
        }

        const petsPerSlide = getPetsPerSlide();

        let newSlide = [];
        for (let i = 0; i < petsPerSlide; i++) {
            let randomPet = getRandomPet(pets.length, oldSliderNumbers);

            while (newSlide.includes(randomPet)) {
                randomPet = getRandomPet(pets.length, oldSliderNumbers);
            }

            newSlide.push(randomPet);
        }


        oldSliderNumbers = [...newSlide];


        newSlide = newSlide.map(number => {
            const sliderItem = createSliderItem(pets[number]);
            return sliderItem
        });

        generateFirstSliderItems(newSlide, direction);
    }

    
    const generateFirstSliderItems = async (items, direction = 'to-start') => {
        const sliderList = document.querySelector('#slider__list');

        items.forEach(item => {
            if (direction === 'to-start') {
                sliderList.prepend(item);
                return
            }

            if (direction === 'to-end') {
                sliderList.appendChild(item);
                return
            }
        });
    }

    createSlide();


    let currentPosition = 0;

    const getSliderItemTotalWidth = () => {
        const sliderItem = document.querySelector('.slider__item');
        const sliderItemStyles = window.getComputedStyle(sliderItem);
        const sliderItemWidth = parseInt(sliderItemStyles.width);
        const sliderItemMargin = parseInt(sliderItemStyles['margin-right']);
        return sliderItemWidth + sliderItemMargin;
    }

    prevSlide.addEventListener("click", () => {
        const sliderList = document.querySelector('.slider__list');
        const sliderListStyles = window.getComputedStyle(sliderList);

        const sliderItemTotal = getSliderItemTotalWidth();
        const petsPerSlide = getPetsPerSlide();

        const sliderListLeftOffset = parseInt(sliderListStyles.left);

        currentPosition += sliderItemTotal * petsPerSlide;
        
        if (currentPosition + sliderListLeftOffset > 0) {
            createSlide();
            sliderList.style.left = `${-currentPosition}px`;
        }

        sliderList.style.transform = `translateX(${currentPosition}px)`;

    });

    nextSlide.addEventListener("click", () => {
        const sliderList = document.querySelector('#slider__list');
        const petsPerSlide = getPetsPerSlide();
        const sliderItemTotal = getSliderItemTotalWidth();

        currentPosition -= sliderItemTotal * petsPerSlide;
        
        createSlide('to-end');

        sliderList.style.transform = `translateX(${currentPosition}px)`;
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

    const slides = document.querySelectorAll('.slider .slider__item');

    slides.forEach(slide => {
        slide.addEventListener('click', async function(event) {
            if (pets.length === 0) {
                pets = await getPets();
            }

            const currentPetName = this.querySelector('.title').textContent;
            
            const currentPetInfo = pets.find(pet => pet.name === currentPetName);

            fillPopup(currentPetInfo);

            toggleBodyScrolling();
            togglePopup();

        });
    });

    const popupCloseBtn = document.querySelector('#btn-close-popup');
    const popup = document.querySelector("#popup");

    popupCloseBtn.addEventListener("click", () => {
        togglePopup();
        toggleBodyScrolling();
    });

    popup.addEventListener("click", function(event) {
        const isShown = this.classList.contains('popup--active');
        
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
    }

    const togglePopup = () => {
        const popup = document.querySelector('#popup');
        popup.classList.toggle("popup--active");
    }

    const toggleHeaderHeight = () => {

        if (header.classList.contains("main-header--active")) {
            header.style.height = '100%';
        } else {
            setTimeout(() => {
                header.style.height = 'inherit';
            }, 500);
        }
    }

});