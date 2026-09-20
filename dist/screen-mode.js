/* Fullscreen and Screen Wake Lock are optional browser capabilities, never OS settings. */
export class ScreenMode {
  constructor({document:doc=document,navigator:nav=navigator,window:win=window,onChange=()=>{}}={}) {
    this.doc=doc;this.nav=nav;this.root=doc.documentElement;this.onChange=onChange;
    this.active=false;this.epoch=0;this.visibilityEpoch=0;this.lock=null;this.pending=null;this.fullscreenOwned=false;
    this.wakeStatus='off';this.fullscreenStatus='window';
    doc.addEventListener('visibilitychange',()=>{
      this.visibilityEpoch++;if(!this.active)return;
      if(doc.visibilityState==='visible')void this.acquire();
      else {this.release();this.wakeStatus='hidden';this.emit();}
    });
    doc.addEventListener('fullscreenchange',()=>{
      if(doc.fullscreenElement===this.root){this.fullscreenOwned=true;this.fullscreenStatus='full';this.emit();}
      else if(this.fullscreenOwned){this.fullscreenOwned=false;this.fullscreenStatus='window';if(this.active)void this.stop(false);}
    });
    win.addEventListener('pagehide',()=>void this.stop(false));
  }
  emit(){this.onChange({active:this.active,wake:this.wakeStatus,fullscreen:this.fullscreenStatus});}
  toggle(){return this.active?this.stop():this.start();}
  start(){if(this.active)return this.retry();this.active=true;this.epoch++;this.emit();return this.retry();}
  retry(){if(!this.active)return Promise.resolve();
    // Start fullscreen directly in the click/keypress call stack, before awaiting wake lock.
    const fullscreen=this.enterFullscreen();const wake=this.acquire();return Promise.allSettled([fullscreen,wake]);
  }
  async enterFullscreen(){
    if(this.doc.fullscreenElement===this.root){this.fullscreenOwned=true;this.fullscreenStatus='full';this.emit();return;}
    if(!this.root.requestFullscreen||this.doc.fullscreenEnabled===false){this.fullscreenStatus='unavailable';this.emit();return;}
    this.fullscreenStatus='requesting';this.emit();
    try{await this.root.requestFullscreen();
      if(!this.active){if(this.doc.fullscreenElement===this.root)await this.doc.exitFullscreen();return;}
      this.fullscreenOwned=this.doc.fullscreenElement===this.root;
      this.fullscreenStatus=this.fullscreenOwned?'full':'unavailable';
    }catch{this.fullscreenStatus='unavailable';}
    this.emit();
  }
  acquire(){
    if(!this.active||this.doc.visibilityState!=='visible')return Promise.resolve();
    if(this.lock&&!this.lock.released)return Promise.resolve();
    if(this.pending)return this.pending;
    if(!this.nav.wakeLock?.request){this.wakeStatus='unsupported';this.emit();return Promise.resolve();}
    const epoch=this.epoch,visibilityEpoch=this.visibilityEpoch;this.wakeStatus='requesting';this.emit();
    this.pending=(async()=>{
      try{const sentinel=await Promise.resolve().then(()=>this.nav.wakeLock.request('screen'));
        if(!this.active||epoch!==this.epoch||visibilityEpoch!==this.visibilityEpoch||this.doc.visibilityState!=='visible'){await sentinel.release();return;}
        this.lock=sentinel;this.wakeStatus=sentinel.released?'released':'held';
        sentinel.addEventListener('release',()=>{
          if(this.lock!==sentinel)return;
          this.lock=null;this.wakeStatus=this.active?(this.doc.visibilityState==='visible'?'released':'hidden'):'off';this.emit();
          // No automatic retry loop after system revocation (battery/power policy).
        });this.emit();
      }catch{if(this.active&&epoch===this.epoch){this.wakeStatus='blocked';this.emit();}}
      finally{this.pending=null;if(this.active&&(epoch!==this.epoch||visibilityEpoch!==this.visibilityEpoch)&&this.doc.visibilityState==='visible')void this.acquire();}
    })();return this.pending;
  }
  release(){const sentinel=this.lock;this.lock=null;if(sentinel&&!sentinel.released)void sentinel.release().catch(()=>{});}
  async stop(exitFullscreen=true){this.active=false;this.epoch++;this.release();this.wakeStatus='off';this.emit();
    if(exitFullscreen&&this.fullscreenOwned&&this.doc.fullscreenElement===this.root){try{await this.doc.exitFullscreen();}catch{}}
    this.fullscreenOwned=false;this.fullscreenStatus='window';this.emit();
  }
}
