const swiperEl = document.querySelector('swiper-container');

const params = {
  injectStyles: [`
      .swiper-pagination-bullet {
        width: 7rem;
        height: 2.5rem;
        padding-inline: 10px;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        color: #000;
        opacity: 1;
        border-radius: 10px !important;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.2);
      }

      .swiper-pagination-bullet-active {
        color: #fff;
        background: #007aff;
      }
      `],
  pagination: {
    clickable: true,
    renderBullet: function (index, className) {
      if (index === 0) {
        return '<span class="' + className + '">' + 'Calendar View' + "</span>";
      } else if (index === 1) {
        return '<span class="' + className + '">' + 'List View' + "</span>";
      }
    },
  },
}

Object.assign(swiperEl, params)

swiperEl.initialize();