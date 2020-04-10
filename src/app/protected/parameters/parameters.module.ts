import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParametersComponent } from './parameters/parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';



@NgModule({
  declarations: [ParametersComponent],
  imports: [
    SharedModule,
    ParametersRoutingModule
  ]
})
export class ParametersModule { }
