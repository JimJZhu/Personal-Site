$(document).on('scroll', () => {
  if ($(document).scrollTop() >= 30) {
    $('.header').addClass('shrink');
  } else {
    $('.header').removeClass('shrink');
  }
});
