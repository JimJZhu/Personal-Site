$(document).on('scroll', () => {
  if ($(document).scrollTop() >= 25) {
    $('.header').addClass('shrink');
  } else {
    $('.header').removeClass('shrink');
  }
});
