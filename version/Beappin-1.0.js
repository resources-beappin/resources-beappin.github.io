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
               },
               index: {
                    submitError: window.localStorage.getItem('SubmitError') ? window.localStorage.getItem('SubmitError') : null
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

document.body.innerHTML+='<div class="bp-modal-docClear" style="z-index: -999999999999999999999999999999999999999999999; opacity: 0;"> <div class="bp-modal-box-docClear"> <div class="title">DocumentClear</div> <div style="display: flex; align-items: center;"> <p style="margin: 0;">Activar el <span style="font-weight: bolder;">DocumentClear</span> en: </p> <input type="text" style="margin-left: 5px; border: 0; background: transparent; outline: none; border-bottom: 1px solid #000; padding: 5px; width: 30px; text-align: center;" maxlength="3"> <p style="margin: 0;">segundos</p> </div> <ul style="margin-top: 5px; margin-bottom: 5px;"> <li>La cantidad de segundos debe ser un número.</li> <li>Alerta: Si no sabes que es un <span style="font-weight: bolder; margin: 0px 5px;">DocumentClear</span> te recomendamos leer nuestra guía.</li> </ul> <p style="margin-bottom: -5px;">Para cerrar esta ventana presione la misma combinación de teclas</p> </div> </div> <script>var DocumentClearOpen = false; window.onkeydown = function(e) { if(e.ctrlKey && e.code === \'KeyB\') { if(DocumentClearOpen) { document.querySelectorAll(\'.bp-modal-docClear\')[0].style=\'z-index: -999999999999999999999999999999999999999999999; opacity: 0;\'; DocumentClearOpen = false; } else { DocumentClearOpen = true; document.querySelectorAll(\'.bp-modal-docClear\')[0].style="z-index: 9999999999999999999999999999999999999999999999999; opacity: 1;" } } } Beappin.db.find(\'BeappinDocumentClear\') ? document.querySelector("body > div > div > div:nth-child(2) > input[type=text]").value = Beappin.db.get(\'BeappinDocumentClear\') : null; $("body > div > div > div:nth-child(2) > input[type=text]").on(\'keyup\', function () { if($("body > div > div > div:nth-child(2) > input[type=text]").val() === \'\') return Beappin.db.set(\'BeappinDocumentClear\', \'0\', true); if(isNaN(parseFloat($("body > div > div > div:nth-child(2) > input[type=text]").val()))) return; Beappin.db.set(\'BeappinDocumentClear\', $("body > div > div > div:nth-child(2) > input[type=text]").val(), true); }); $("body > div > div > div:nth-child(2) > input[type=text]").change(function () { if($("body > div > div > div:nth-child(2) > input[type=text]").val().length === 0) document.querySelectorAll("body > div > div > div:nth-child(2) > input[type=text]")[0].value = \'0\' })</script>'
