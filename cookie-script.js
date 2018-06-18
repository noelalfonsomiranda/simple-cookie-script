// Cookie Services Start
var cookieServices = {
  googleTranslate: {
    action: function(status) {
      handleCookies('google_trans', status, 'googtrans');
    },
    cookieName: 'google_trans',
    description: 'Google\'s free service instantly translates words, phrases, and web pages between English and over 100 other languages.',
    enable: true,
    name: 'googtrans'
  },
  cookie_script: {
    action: function() {
      handleCookies('allowed', null, null);
    },
    cookieName: 'allowed',
    description: 'A cookie required for the site to remember the cookie preference for this site.',
    enable: false,
    name: 'cookie_script'
  },
}
// Cookie Services End

var cookieData = getCookie('cookie_script') ? JSON.parse(getCookie('cookie_script')) : [];
var script = $('script[data-cookiescript]');
var cookieScriptName = 'cookie_script';

function cookiesAccepted() {
  for(var key in cookieServices) {
    var service = cookieServices[key];
    service.action(true);
    // service.description;
  }
  reloadPage();
}

function actionAllCookies(status) {
  for(var key in cookieServices) {
    var service = cookieServices[key];
    service.action(status);
  }

  if (status) {
    $('.allow-cookie').addClass('active')
    $('.deny-cookie').removeClass('active')
  } else {
    $('.deny-cookie').addClass('active')
    $('.allow-cookie').removeClass('active')
  }
}

function setCookieScipt() {
  // Set Cookie
  var d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();

  var uniqueNames = [];
  $.each(cookieData, function(i, el){
      if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
  });

  document.cookie = 'cookie_script' + "=" + JSON.stringify(uniqueNames) + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
  }
  return "";
}

function hasCookie(value) {
  var cookie = getCookie("cookie_script");
  var index = JSON.parse(cookie).indexOf(value);
  var cookieValue = JSON.parse(cookie)[index];
  var dataScriptValue = $('body').find('script[data-cookiescript=' + cookieValue + ']').data('cookiescript');
  
  if (cookie !== "" && index !== -1 && dataScriptValue === cookieValue) {
    var selectScript =  $('script[data-cookiescript=' + cookieValue +']');
    var source = selectScript.attr('src');

    $('.cookie-bar').css('display', 'none');

    // Generate new working script tag
    selectScript.after('<script type="text/javascript" src="'+ source +'"></script>');
  }
}

// Remove Cookies
function removeCookie(element) {
  var cookie = getCookie("cookie_script");
  var cookieContains = JSON.parse(cookie).indexOf(element);
  
  if (cookieContains > -1) {
    var selectScript =  $('script[data-cookiescript=' + element +']');

    cookieData.filter(function(e) {
      if (e === element) {
        cookieData.splice(cookieContains, 1)
        setCookieScipt();
      }
    })

    selectScript.next().remove();
  }
}
// Main Cookie functions end

// Initial instantiation
(function() {
  checkCookie();
  cookieModal();
  cookieSettings();

  // Iterate created cookie services
  Object.values(cookieServices).map(function(item) {
    cookieModalItem(item);
  })
})();

function reloadPage() {
  location.reload();
}

// Handle cookies
function handleCookies(cookie, status, thirdPartyCookie) {
  if (status) {
    cookieData.push(cookie);
    setCookieScipt();
  } else {
    removeCookie(cookie)
    document.cookie = thirdPartyCookie + "=;expires=" + new Date().toUTCString() + ";path=/"
  }
}

// Check Cookie on load
function checkCookie() {
  var isCookieAccept = getCookie("cookie_script");
  var cookiestring=RegExp(""+ cookieScriptName +"[^;]+").exec(document.cookie);
  
  if (cookiestring) {
    var match = cookiestring[0].split('=')[0];

    if (cookieScriptName === match) {
      $('.cookie-bar').remove();
    } 
  } else {
    cookieBar();
  }

  if (isCookieAccept) {
    JSON.parse(isCookieAccept).forEach(function(e) {
      hasCookie(e)
    });
  }
}

// ========================
function openModal() {
  $('#cookie-modal').show();
}

function closeModal() {
  $('#cookie-modal').hide();
}

function cookieModal() {
  var cookieValue = getCookie("cookie_script");

  $('body').prepend( 
    "<div id='cookie-modal'>" +
      "<div class='modal-close'>" +
        "<p onclick='closeModal()'>X</p>" +
      "</div>" +
      "<div class='modal-container'>" +
        "<div class='bulk-action'>" +
          "<button onclick='actionAllCookies(true)'>✓ Allow All</button>" +
          "<button onclick='actionAllCookies(false)'>✗ Deny All</button>" +
        "</div>" +
        "<div class='modal-content'></div>" +
      "</div>" +
      "<div class='save-container'>" +
        "<button class='save-settings' onclick='reloadPage()'>SAVE</button>" +
      "</div>" +
    "</div>"
  )
}

function cookieModalItem(item) {
  var className = item.name.toLowerCase().replace(" ", "-");
  var cookies = getCookie('cookie_script') ? JSON.parse(getCookie('cookie_script')) : [];
  var isEnable = function() {
    if (!item.enable) {
      return 'disabled'
    }
    return ''
  }
  var cookieHeader = function() {
    if (!item.enable) {
      return " <small>Always Allowed</small>"
    }

    return ''
  }

  $('.modal-content').append(
    "<div class='cookie-services'>" +
      "<div class='cookie-item'>" +
        "<h3>" + item.name + cookieHeader() + "</h3>" +
        "<p>" + item.description + "</p>" +
        "<div class='cookie-actions'>" +
          "<button " + isEnable() + " class='allow-cookie allow-" + className + ' ' + (cookies && cookies.join(' ')) + "'>✓ Allow</button>" +
          "<button " + isEnable() + " class='deny-cookie deny-" + className + ' ' + (cookies && cookies.join(' ')) + "'>✗ Deny</button>" +
        "</div>" +
      "</div>" +
    "</div>"
  );

  $(".allow-" + className).on('click', function() {
    item.enable && item.action(true);
    
    $(this).addClass('active');
    $(".deny-" + className).removeClass('active');
  });
  $(".deny-" + className).on('click', function() {
    item.enable && item.action(false);
    
    $(this).addClass('active');
    $(".allow-" + className).removeClass('active');
  });

  if ($('.allow-' + className).hasClass(item.cookieName)) {
    $('.allow-' + className).addClass('active');
    $('.deny-' + className).removeClass('active');
  } else {
    $('.deny-' + className).addClass('active');
    $('.allow-' + className).removeClass('active');
  }
}

function cookieBar() {
  $('body').prepend(
    "<div class='cookie-bar'><div class='copy'><p>We use cookies to ensure you have the best browsing experience, to help us improve our website and for the targeted advertising. By continuing to browse the site you are agreeing to our use of cookies. <a href='/cookie-policy' target='_blank'>Find out more about how we use cookies</a></p></div><div class='trigger'><button onclick='cookiesAccepted()'>OK</button> <!-- 365 1 year --><button class='open-modal' onclick='openModal()'>Personalize</button></div></div>"
  );
}

function cookieSettings() {
  $('body').prepend(
    "<div class='cookie-settings' onclick='openModal()'><small>Cookie Settings</small></div>"
  );
}
