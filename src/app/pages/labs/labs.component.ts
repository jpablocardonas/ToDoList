import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  lugar = signal("");
  tecnologia = "Angular";
  tasks = signal([
    "Tarea 1",
    "Tarea 2",
    "Tarea 3"
  ]);
  nombre = signal("");

  nameCtrl = new FormControl('nombre',{
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  mostrarCambio(event: Event){
    const contenido = event.target as HTMLInputElement;
    const nuevoValor = contenido.value;
    this.nombre.set(nuevoValor);
    this.lugar.set("");
  }

  person = {
    nombre: 'Carlos',
    apellido: 'Cardona Salazar',
    edad: 23,
  }

  
}
