const Beappin = {
     config: {
          displayErrors: true,
          modalAnimationDuration: 200
     },
     themeConfig: {

     },
     db: {
          find: (key) => {
               let error = (err) => {
                    if(Beappin.config.displayErrors) console.error(err);
               }
               if(!key) {
                    error('No se ha encontrado parámetros para .find()');
                    return null;
               };
               if(window.localStorage.getItem(key) === null) return false;
               return true;
          },
          get: (key) => {
               let error = (err) => {
                    if(Beappin.config.displayErrors) console.error(err);
               }
               if(!key) {
                    error('No se ha encontrado parámetros para .get()');
                    return null;
               };
               if(window.localStorage.getItem(key) === null) {
                    error('No se ha encontrado '+key+' en la base de datos');
                    return null;
               }
               return window.localStorage.getItem(key);
          },
          set: (key, value, replace=false) => {
               let error = (err) => {
                    if(Beappin.config.displayErrors) console.error(err);
               }
               if(!key) {
                    error('No se ha encontrado el parámetro key para .set()');
                    return null;
               };

               if(!value) {
                    error('No se ha encontrado el parámetro value para .set()');
                    return null;
               };

               if(window.localStorage.getItem(key) !== null && !replace) {
                    error('La variable '+key+' ya está usada!');
                    return null;
               }

               if(replace) {
                    window.localStorage.removeItem(key);
               }

               window.localStorage.setItem(key, value);
               return true;
          },
          toggle: (key, value) => {
               let error = (err) => {
                    if(Beappin.config.displayErrors) console.error(err);
               }
               if(!key) {
                    error('No se ha encontrado el parámetro key para .toggle()');
                    return null;
               };

               if(!value) {
                    error('No se ha encontrado el parámetro value para .toggle()');
                    return null;
               };

               if(window.localStorage.getItem(key) !== null) {
                    window.localStorage.removeItem(key);
                    return false;
               } else {
                    window.localStorage.setItem(key, value);
                    return true;
               }
          },
          remove: (key) => {
               let error = (err) => {
                    if(Beappin.config.displayErrors) console.error(err);
               }
               if(!key) {
                    error('No se ha encontrado el parámetro key para .remove()');
                    return null;
               };

               if(window.localStorage.getItem(key) === null) {
                    error('No se ha encontrado la variable en la base de datos.');
                    return null;
               }

               window.localStorage.removeItem(key);
               return true;
          }
     },
     css: {
          toggleModal: (html=null, options=false) => {
               Beappin.db.set('BeappinThemeConfig', convert(Beappin.themeConfig), true);
               let error = (err) => {
                    if(Beappin.config.displayErrors) console.error(err);
               }
               if(document.querySelectorAll('.bp-modal').length > 0) {
                    return document.querySelectorAll('.bp-modal.active')[0].remove();
               }

               if(Beappin.config.modalAnimationDuration !== 200) {
                    let style = document.createElement('style');
                    style.innerText=":root { --modal-duration: "+Beappin.config.modalAnimationDuration+"ms }";
                    document.head.appendChild(style);
               }
               let bpModal = document.createElement('div');
               bpModal.classList.add('bp-modal');
               bpModal.innerHTML='<div class="bp-modal-box"><i class="fal fa-times close"></i>'+html+'</div>';
               if(options) {
                    bpModal.querySelectorAll('input[type="checkbox"]').forEach(c => {
                         Beappin.themeConfig.forEach(cfg => {
                              if(Beappin.db.find(Object.keys(cfg)[0]) && Object.keys(cfg)[0] === c.getAttribute('id')) {
                                   c.setAttribute('checked', '');
                              }
                         })
                    });
               }
               document.body.appendChild(bpModal);
               setTimeout(() => {
                    bpModal.classList.add('active');
                    document.querySelectorAll('.bp-modal.active')[0].addEventListener('click', function(e) {
                         if(e.target !== e.currentTarget) return;
                         document.querySelectorAll('.bp-modal.active')[0].classList.add('remove');
                         document.querySelectorAll('.bp-modal.active')[0].classList.remove('active');
                         setTimeout(() => {
                              document.querySelectorAll('.bp-modal')[0].remove();
                         }, Beappin.config.modalAnimationDuration);
                    });
                    document.querySelectorAll('.bp-modal .bp-modal-box i.close')[0].addEventListener('click', function(e) {
                         if(e.target !== e.currentTarget) return;
                         document.querySelectorAll('.bp-modal.active')[0].classList.add('remove');
                         document.querySelectorAll('.bp-modal.active')[0].classList.remove('active');
                         setTimeout(() => {
                              document.querySelectorAll('.bp-modal')[0].remove();
                         }, Beappin.config.modalAnimationDuration);
                    });
                    if(options) {
                         document.querySelectorAll('input[type="checkbox"]').forEach(i => i.addEventListener('click', function(e) {
                              Beappin.themeConfig.forEach(cfg => {
                                   if(Object.keys(cfg)[0] === e.path[0].getAttribute('id')) {
                                        function convert(obj) {
                                             let ret = "{";
                                           
                                             for (let k in obj) {
                                               let v = obj[k];
                                           
                                               if (typeof v === "function") {
                                                 v = v.toString();
                                               } else if (v instanceof Array) {
                                                 v = JSON.stringify(v);
                                               } else if (typeof v === "object") {
                                                 v = convert(v);
                                               } else {
                                                 v = `"${v}"`;
                                               }

                                               if(!isNaN(parseInt(k))) {
                                                  ret += `\n  ${v},`;
                                               } else {
                                                  ret += `\n  ${k}: ${v},`;
                                               }
                                           
                                             }
                                           
                                             ret += "\n}";
                                           
                                             return ret;
                                           }
                                        cfg[Object.keys(cfg)[0]].onChange({'status': e.path[0].checked, 'element': e.path[0]});
                                        Beappin.db.set('BeappinThemeConfigLength', Beappin.themeConfig.length, true);
                                        Beappin.db.set('BeappinThemeConfig', convert(Beappin.themeConfig), true);
                                   }
                              });
                         }));
                    }
               }, 1);
          }
     },
     user: {
          intranet: {
               concepto: {
                    options: () => {
                         let conceptoOptions = [];
                         let iframe = document.createElement('iframe');
                         iframe.src="http://appu.educarperu.com/admincolegio/vista_alumnoappu/concepto.php";
                         iframe.style="position: absolute; width: 0; height: 0; z-index: -9999999999999; opacity: 0;";
                         document.body.appendChild(iframe);
                         iframe.onload = () => {
                              let iframeContent = iframe.contentWindow.document;
                              iframeContent.querySelectorAll('td.primerafila .menuitem').forEach(option => {
                                   conceptoOptions.push({title: (option.querySelectorAll('.menuitemtitulo')[0] ? option.querySelectorAll('.menuitemtitulo')[0].innerHTML.trim() : ''), description: option.querySelectorAll('.menuitemtext')[0] ? option.querySelectorAll('.menuitemtext')[0].innerHTML.trim() : '', imageURL: (option.querySelectorAll('.menuitemimagen a img') ? option.querySelectorAll('.menuitemimagen a img')[0].getAttribute('src') : ''), URL: (option.querySelectorAll('.menuitemimagen')[0].querySelectorAll('a')[0].getAttribute('href') ? option.querySelectorAll('.menuitemimagen')[0].querySelectorAll('a')[0].getAttribute('href') : '')})
                              });
                              return conceptoOptions;
                         }
                    }
               }
          }
     },
     actualPage: window.location.href.split('/').at(-1)
};

function convert(obj) {
     let ret = "{";
   
     for (let k in obj) {
       let v = obj[k];
   
       if (typeof v === "function") {
         v = v.toString();
       } else if (v instanceof Array) {
         v = JSON.stringify(v);
       } else if (typeof v === "object") {
         v = convert(v);
       } else {
         v = `"${v}"`;
       }

       if(!isNaN(parseInt(k))) {
          ret += `\n  ${v},`;
       } else {
          ret += `\n  ${k}: ${v},`;
       }
   
     }
   
     ret += "\n}";
   
     return ret;
   }

if(window.localStorage.getItem('BeappinThemeConfig') !== null) {
     for(let i = 0; i < eval('['+window.localStorage.getItem('BeappinThemeConfig').slice(1).slice(0, -1)+']').length; i++) {
          if(window.localStorage.getItem(Object.keys(eval('['+window.localStorage.getItem('BeappinThemeConfig').split(" 0:").join("").slice(1).slice(0, -1)+']')[i])[0]) !== null) {
               eval('['+window.localStorage.getItem('BeappinThemeConfig').slice(1).slice(0, -1)+']')[i][Object.keys(eval('['+window.localStorage.getItem('BeappinThemeConfig').split(" 0:").join("").slice(1).slice(0, -1)+']')[i])[0]].onTrue();
          }
     }
}

document.querySelectorAll('form').forEach(f => {
    f.addEventListener('submit', () => {
        window.localStorage.setItem('onSubmitForm', 'true');
    })
});
