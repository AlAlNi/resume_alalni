// Полные данные маршрута (7 дней)
const tripData = [
  {
    day: "День 1 (18 апреля)",
    title: "Архитектурный восторг",
    activities: [
      {
        time: "11:00-14:00",
        title: "Alserkal Avenue",
        description: "Уличные инсталляции и галерея Carbon 12 (современное искусство)",
        cost: "",
        images: [
          "https://alserkal.online/static/6b604ef98648a3860956af1c5a553590/2df75/Carbon12-2.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dubai_Alserkal_Avenue_2024-11-17.jpg/1280px-Dubai_Alserkal_Avenue_2024-11-17.jpg"
        ]
      },
      {
        time: "14:00-15:00",
        title: "Nightjar Coffee",
        description: "Лучший кофе в районе + сытные тосты",
        cost: "120 дирхам",
        images: [
          "https://wow-emirates.com/wp-content/uploads/2024/02/Untitled-design-2024-02-29T221552.488.jpg"
        ]
      },
      {
        time: "16:00-19:00",
        title: "Dubai Marina",
        description: "Фотографируйте изгибы Cayan Tower (спиральный небоскреб)",
        cost: "",
        images: [
          "https://www.visitdubai.com/-/media/gathercontent/poi/c/cayan-tower/fallback-image/cayan-tower-poi-gettyimages.jpg"
        ]
      }
    ]
  },
  {
    day: "День 2 (19 апреля)",
    title: "Russian Design Forum",
    activities: [
      {
        time: "09:00-18:00",
        title: "St. Regis The Palm",
        description: "Участие в Russian Design Forum",
        cost: "",
        images: [
          "https://pix8.agoda.net/hotelImages/22996425/0/5327d585efb78c31132686dbb6a4710a.jpeg?ce=0&s=1024x"
        ]
      },
      {
        time: "19:00-21:00",
        title: "The Pointe",
        description: "Вид на Бурдж-аль-Араб, ужин в Eauzone",
        cost: "200 дирхам",
        images: [
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/78/80/d7/eauzone-outdoor.jpg?w=900&h=500&s=1"
        ]
      }
    ]
  },
  {
    day: "День 3 (20 апреля)",
    title: "Старый город + Дизайн",
    activities: [
      {
        time: "09:00-12:00",
        title: "Al Fahidi District",
        description: "Ретро-двери, Museum Cafe со светильниками из верблюжьей кожи",
        cost: "",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNsPXmgIZczf75SKvj4auHQ4UHs5oTILPo3g&s"
        ]
      },
      {
        time: "14:00-17:00",
        title: "Design District (d3)",
        description: "Муралы и шоу-румы (не пропустите Amariden)",
        cost: "",
        images: [
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/90/7d/73/img-20171202-111345-largejpg.jpg?w=900&h=-1&s=1"
        ]
      }
    ]
  },
  {
    day: "День 4 (21 апреля)",
    title: "Природа + Роскошь",
    activities: [
      {
        time: "09:00-12:00",
        title: "The Green Planet",
        description: "Био-архитектура: вертикальный лес в стеклянной колбе",
        cost: "110 дирхам",
        images: [
          "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/11/ee/75/99.jpg"
        ]
      },
      {
        time: "13:00-14:00",
        title: "The Farm",
        description: "Ресторан в пальмовой роще",
        cost: "140 дирхам",
        images: [
          "https://avatars.mds.yandex.net/get-altay/13929277/dd6cc7cc225460696680179117f4abaf.jpg/orig"
        ]
      },
      {
        time: "15:00-18:00",
        title: "Atlantis The Palm",
        description: "Интерьеры аквапарка в морском стиле",
        cost: "",
        images: [
          "https://www.watg.com/wp-content/uploads/2008/06/034063_N5_highres-scaled.jpg"
        ]
      }
    ]
  },
  {
    day: "День 5 (22 апреля)",
    title: "Downtown Dubai",
    activities: [
      {
        time: "10:00-13:00",
        title: "Бурдж-Халифа",
        description: "Уровень 148 + фото у фонтанов",
        cost: "350 дирхам",
        images: [
          "https://media-cdn.tripadvisor.com/media/photo-s/0e/c9/04/9c/level-148.jpg"
        ]
      },
      {
        time: "13:30-15:00",
        title: "Dubai Mall",
        description: "Инсталляция «Водопад» и галерея Opera Gallery",
        cost: "",
        images: [
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/a7/2e/ed/united-arab-emirates.jpg?w=900&h=-1&s=1"
        ]
      },
      {
        time: "19:00-21:00",
        title: "CE LA VI",
        description: "Ужин с панорамным видом на Downtown",
        cost: "250 дирхам",
        images: [
          "https://c.ekstatic.net/dex-media/10269/celavi-Desktop-ActivityDetails-1-1.jpg"
        ]
      }
    ]
  },
  {
    day: "День 6 (23 апреля)",
    title: "Свободный день",
    activities: [
      {
        time: "10:00-12:00",
        title: "La Mer",
        description: "Граффити-зона и дизайн пляжных домиков",
        cost: "",
        images: [
          "https://guide-tours.ru/wp-content/uploads/2024/01/plyazh-la-mer-v-dubae-3-jpg.webp"
        ]
      },
      {
        time: "14:00-16:00",
        title: "Tashkeel Studio",
        description: "Мастер-класс по арабской каллиграфии",
        cost: "180 дирхам",
        images: [
          "https://www.timeoutdubai.com/cloud/timeoutdubai/2021/09/13/93IuLWTK-Tashkeel-1200x900.jpg"
        ]
      },
      {
        time: "19:00-21:00",
        title: "Pierchic",
        description: "Ужин на пирсе с видом на Бурдж-аль-Араб",
        cost: "300 дирхам",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh3NuZgAH8j31weib5hXlfxxwTBzlMpS82fw&s"
        ]
      }
    ]
  },
  {
    day: "День 7 (24 апреля)",
    title: "Завершение поездки",
    activities: [
      {
        time: "09:00-11:00",
        title: "Business Bay Promenade",
        description: "Фото небоскребов с отражением в канале",
        cost: "",
        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        ]
      },
      {
        time: "11:30-13:00",
        title: "Souk Al Bahar",
        description: "Сувениры и обед в Eataly",
        cost: "120 дирхам",
        images: [
          "https://media.cool-cities.com/souk_al_bahar007db_x_mob.jpg?h=254"
        ]
      },
      {
        time: "16:00",
        title: "Выезд в аэропорт",
        description: "Трансфер в DXB (20-25 мин в пути)",
        cost: "",
        images: []
      }
    ]
  }
];

// Координаты для карты
const locations = [
  { id: 1, lat: 25.1193, lon: 55.2108, name: "Revier Hotel", day: 0 },
  { id: 2, lat: 25.1106, lon: 55.1598, name: "Alserkal Avenue", day: 0 },
  { id: 3, lat: 25.0760, lon: 55.1328, name: "Al Fahidi District", day: 2 },
  { id: 4, lat: 25.1124, lon: 55.1389, name: "Design District (d3)", day: 2 },
  { id: 5, lat: 25.1215, lon: 55.1853, name: "St. Regis The Palm", day: 1 },
  { id: 6, lat: 25.0931, lon: 55.1520, name: "The Green Planet", day: 3 },
  { id: 7, lat: 25.1972, lon: 55.2744, name: "Atlantis The Palm", day: 3 },
  { id: 8, lat: 25.1976, lon: 55.2797, name: "La Mer", day: 5 },
  { id: 9, lat: 25.1921, lon: 55.2738, name: "Pierchic", day: 5 },
  { id: 10, lat: 25.2048, lon: 55.2708, name: "Burj Khalifa", day: 4 },
  { id: 11, lat: 25.1193, lon: 55.2108, name: "Business Bay Promenade", day: 6 }
];

// Инициализация приложения
function initApp() {
  generateItinerary();
  initImageModal();
  loadYandexMaps();
}

// Генерация маршрута
function generateItinerary() {
  const itineraryEl = document.getElementById('itinerary');
  if (!itineraryEl) return;

  itineraryEl.innerHTML = '';
  
  tripData.forEach((dayData, index) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    dayCard.dataset.day = index;
    
    dayCard.innerHTML = `
      <div class="day-header">
        <h3>${dayData.day}</h3>
        <span>${dayData.title}</span>
      </div>
      <div class="day-content"></div>
    `;
    
    const dayContent = dayCard.querySelector('.day-content');
    
    dayData.activities.forEach(activity => {
      const galleryHTML = activity.images?.length > 0 
        ? `<div class="gallery">
             ${activity.images.map(img => `<img src="${img}" alt="${activity.title}" loading="lazy">`).join('')}
           </div>`
        : '';
      
      dayContent.innerHTML += `
        <div class="activity">
          <div class="time">${activity.time}</div>
          <div class="activity-details">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            ${activity.cost ? `<div class="activity-cost">${activity.cost}</div>` : ''}
            ${galleryHTML}
          </div>
        </div>
      `;
    });
    
    dayCard.querySelector('.day-header').addEventListener('click', () => {
      dayCard.classList.toggle('active');
    });
    
    itineraryEl.appendChild(dayCard);
  });
}

// Инициализация модального окна для изображений
function initImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeModal = document.querySelector('.close-modal');
  
  if (!modal || !modalImg || !closeModal) return;

  document.addEventListener('click', (e) => {
    if (e.target.closest('.gallery img')) {
      const img = e.target.closest('img');
      modalImg.src = img.src;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });
  
  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
}

// Загрузка Яндекс.Карт
function loadYandexMaps() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  const script = document.createElement('script');
  script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=35813901-d1dc-4404-9bfd-bfcb01684f18&onload=onYandexMapsLoaded`;
  script.async = true;
  document.head.appendChild(script);

  window.onYandexMapsLoaded = function() {
    if (typeof ymaps !== 'undefined') {
      initYandexMap();
    } else {
      showMapError();
    }
  };
}

// Инициализация Яндекс.Карт
function initYandexMap() {
  try {
    const map = new ymaps.Map('map', {
      center: [25.2048, 55.2708],
      zoom: 11,
      controls: ['zoomControl']
    });

    const dayColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#7DD3FC', '#F472B6'];

    locations.forEach(loc => {
      const placemark = new ymaps.Placemark(
        [loc.lat, loc.lon],
        {
          hintContent: loc.name,
          balloonContent: `<b>${loc.name}</b><br>День ${loc.day + 1}`
        },
        {
          preset: 'islands#circleIcon',
          iconColor: dayColors[loc.day] || '#FF6B6B'
        }
      );
      map.geoObjects.add(placemark);
    });

    tripData.forEach((day, dayIdx) => {
      const dayLocations = locations.filter(loc => loc.day === dayIdx);
      if (dayLocations.length > 1) {
        const coordinates = dayLocations.map(loc => [loc.lat, loc.lon]);
        const polyline = new ymaps.Polyline(
          coordinates,
          {},
          {
            strokeColor: dayColors[dayIdx] || '#FF6B6B',
            strokeWidth: 3,
            strokeOpacity: 0.7
          }
        );
        map.geoObjects.add(polyline);
      }
    });

    map.setBounds(map.geoObjects.getBounds(), {
      checkZoomRange: true
    });

  } catch (error) {
    console.error('Ошибка инициализации карты:', error);
    showMapError();
  }
}

// Показать ошибку загрузки карты
function showMapError() {
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    mapContainer.innerHTML = `
      <div class="map-error">
        <h3>Не удалось загрузить карту</h3>
        <p>Попробуйте перезагрузить страницу</p>
      </div>
    `;
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);