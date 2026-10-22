/* Page d'écoute commune. Chaque cliente a son propre index.html qui contient seulement PAGE = {prenom, affirmations, audio, offre}.
   Modifier ce fichier change toutes les pages d'écoute en une fois. */
(function(){
  /* ---- Réglages communs ---- */
  var STRIPE_ANALYSE = "";            /* ton lien Stripe pour l'Analyse seule ; vide = l'encadré n'apparaît pas */
  var PRIX = "20 €", PRIX_BARRE = "40 €";

  var P = window.PAGE || {};
  var esc = function(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); };
  var affs = (P.affirmations||[]).filter(Boolean);
  var name = P.prenom ? ', <em>'+esc(P.prenom)+'</em>' : '';
  var list = affs.length ? '<details><summary>Ce que contient ton audio (déroule ici)</summary><ol>'+affs.map(function(a){ return '<li>'+esc(/[.!?…]$/.test(a)?a:a+'.')+'</li>'; }).join('')+'</ol></details>' : '';
  var upsell = (P.offre!=="Audio + Analyse" && /^https:\/\//.test(STRIPE_ANALYSE)) ?
    '<a class="down" href="#analyse" aria-label="Voir plus bas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15M6 13l6 6 6-6"/></svg></a>'+
    '<aside class="up" id="analyse"><p class="up-t">Tu veux mon avis d\'experte sur ce qui se passe entre\u00a0vous\u00a0?</p>'+
    '<p class="up-d"><strong>Mon analyse rien que pour toi</strong>, dans un rapport écrit sur ta situation, pour compléter l\'écoute de ton Audio :</p>'+
    '<ul class="up-l"><li>La dynamique que tu ne vois pas</li><li>Pourquoi il se comporte ainsi</li><li>Un mini plan d\'actions à faire</li><li>La routine d\'écoute parfaite de l\'Audio pour ta situation</li></ul>'+
    '<p class="up-q"><strong>Je ne fais plus de coaching individuel</strong>, même si je reçois des demandes tous les jours… Mon Analyse, c\'est ce qui s\'en rapproche le plus : mon regard expert sur ton histoire, noir sur blanc, rien que pour toi.</p>'+
    '<a class="up-b" href="'+esc(STRIPE_ANALYSE)+'" target="_blank" rel="noopener">Je veux mon Analyse · '+PRIX+(PRIX_BARRE?' <s>'+PRIX_BARRE+'</s>':'')+'</a></aside>' : '';

  document.body.innerHTML =
    '<main><div><div class="tag">Ton audio subliminal personnalisé</div><h1>Bonne écoute'+name+'</h1></div>'+
    '<p class="intro">Installe-toi, appuie sur le bouton et pose ton téléphone. Tu n\'as rien d\'autre à faire.</p>'+
    '<button class="play" id="play" aria-label="Lancer l\'audio"><svg id="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg></button>'+
    '<p class="status" id="status" aria-live="polite"></p>'+
    '<fieldset><div class="chips" role="radiogroup" aria-label="Arrêt automatique">'+
    '<label><input type="radio" name="t" value="15"><span>15 min</span></label><label><input type="radio" name="t" value="60"><span>1 h</span></label><label><input type="radio" name="t" value="240"><span>4 h</span></label><label><input type="radio" name="t" value="480" checked><span>8 h</span></label>'+
    '</div></fieldset>'+ list +
    '<p class="note">Tes phrases sont cachées sous une musique douce, à un volume que l\'oreille ne perçoit pas consciemment.</p>'+
    upsell + '</main><audio id="a" src="'+esc(P.audio||'audio.mp4')+'" loop preload="auto"></audio>';

  var a=document.getElementById('a'),btn=document.getElementById('play'),ic=document.getElementById('ic'),st=document.getElementById('status');
  var PLAY='<path d="M8 5.5v13l10.5-6.5z"/>',PAUSE='<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>';
  var timer=null,endAt=0,tick=null;
  var mins=function(){return +document.querySelector('input[name=t]:checked').value;};
  var fmt=function(ms){var m=Math.max(0,Math.round(ms/60000)),h=Math.floor(m/60);return h?h+' h '+String(m%60).padStart(2,'0'):m+' min';};
  function show(){st.textContent=a.paused?'':(endAt?'Arrêt dans '+fmt(endAt-Date.now()):'');}
  function arm(){clearTimeout(timer);endAt=0;if(!a.paused){var m=mins();endAt=Date.now()+m*60000;timer=setTimeout(function(){a.pause();},m*60000);}show();}
  btn.addEventListener('click',function(){ if(a.paused){ var p=a.play(); if(p&&p.catch) p.catch(function(){st.textContent='Appuie encore une fois pour lancer le son.';}); } else a.pause(); });
  a.addEventListener('play',function(){btn.classList.add('on');ic.innerHTML=PAUSE;btn.setAttribute('aria-label','Mettre en pause');arm();clearInterval(tick);tick=setInterval(function(){if(endAt&&Date.now()>=endAt)a.pause();show();},20000);});
  a.addEventListener('pause',function(){btn.classList.remove('on');ic.innerHTML=PLAY;btn.setAttribute('aria-label',"Lancer l'audio");clearTimeout(timer);clearInterval(tick);endAt=0;show();});
  document.querySelectorAll('input[name=t]').forEach(function(r){r.addEventListener('change',arm);});
  if('mediaSession' in navigator){ try{ navigator.mediaSession.metadata=new MediaMetadata({title:'Ton audio subliminal personnalisé',artist:'Musique douce'}); }catch(e){} }
})();
