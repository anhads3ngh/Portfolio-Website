export const FEEDBACK_EMAIL='assarna@ualberta.ca';
export function feedbackMailto(email,message){return 'mailto:'+FEEDBACK_EMAIL+'?subject='+encodeURIComponent('Anhad’s World — visitor feedback')+'&body='+encodeURIComponent('Sender email: '+email.trim()+'\n\nWhat could be better:\n'+message.trim());}
export function createGameFlow(api){
 const welcome=document.querySelector('#game-welcome'),finish=document.querySelector('#journey-finish'),form=document.querySelector('#feedback-form'),entry=new URLSearchParams(location.search);let blocked=true,resume=false,completedShown=false;
 const view=document.querySelector('#start-view');view.value=entry.get('view')==='first'?'first':'third';
 function start(autoplay){const success=api.start({autoplay,view:view.value,chapter:entry.get('chapter')});if(!success){document.querySelector('#start-error').hidden=false;return;}welcome.hidden=true;document.body.classList.remove('awaiting-entry');blocked=false;}
 document.querySelector('#start-map').onclick=()=>{if(api.start({autoplay:false,view:'map'})){welcome.hidden=true;document.body.classList.remove('awaiting-entry');blocked=false;}};
 document.querySelector('#start-autoplay').onclick=()=>start(true);document.querySelector('#start-explore').onclick=()=>start(false);
 document.querySelector('#start-autoplay').disabled=document.querySelector('#start-explore').disabled=false;
 function close(){finish.close();blocked=false;api.continue(resume);resume=false;}
 function showFinish(completed=false){if(finish.open||completed&&completedShown)return;if(completed)completedShown=true;resume=api.pause();blocked=true;document.querySelector('#finish-eyebrow').textContent=completed?'JOURNEY COMPLETE':'TAKE A BREATHER';document.querySelector('#finish-title').innerHTML=completed?'That’s my story.<br><em>What’s your take?</em>':'Thanks for exploring.<br><em>What’s your take?</em>';document.querySelector('#finish-summary').textContent=completed?'Home, campus, a drive, two flights and floor 21. Thanks for taking the scenic route.':'Keep exploring, return to the portfolio, or leave a little feedback before you go.';finish.showModal();}
 document.querySelector('#game-exit').onclick=()=>showFinish(false);document.querySelector('#finish-continue').onclick=close;document.querySelector('#finish-replay').onclick=()=>{finish.close();blocked=false;resume=false;completedShown=false;api.replay();};finish.addEventListener('cancel',e=>{e.preventDefault();close();});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const href=feedbackMailto(form.elements.email.value,form.elements.message.value);document.querySelector('#feedback-status').textContent='Your email draft is ready. Review it in your email app and press Send there.';document.querySelector('#feedback-reopen').href=href;document.querySelector('#feedback-reopen').hidden=false;location.href=href;});
 return {showFinish,markRunning(){completedShown=false;},get blocking(){return blocked;}};
}
