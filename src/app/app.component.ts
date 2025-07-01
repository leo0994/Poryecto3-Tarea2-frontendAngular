import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FondoBonitoComponent } from "./shared/components/fondo-bonito/fondo-bonito.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, FondoBonitoComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {}
