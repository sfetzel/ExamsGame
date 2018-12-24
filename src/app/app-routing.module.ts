import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NameComponent } from './name/name.component';
import { GameComponent } from './game/game.component';

const routes:Routes = [
	{ path: '', component: NameComponent },
	{ path: 'game', component: GameComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
