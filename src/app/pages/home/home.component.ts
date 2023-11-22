import { Component, importProvidersFrom, signal, computed, effect, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, CheckboxControlValueAccessor } from '@angular/forms';

import { Task } from './../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  injector = inject(Injector);

  ngOnInit() {
    //Aquí se define la lógica para cuando se inicializa la componente
    //Esta línea busca en el Local Storage las tasks, las obtiene y las guarda en la variable storage.
    const storage = localStorage.getItem('tasks');
    //Ahora se valida si storage contiene algo, y lo convierte de string a objeto
    //Finalmente se guradn estas tareas convertidas en la variable de la componente para ser renderizadas.
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    effect(() => {
      //Este effect va a trackear la lista de tareas
      const tasks = this.tasks();
      //Con la sig línea ya se guarda en el Local Storage
      //Se puede guardar el array sin problmeas pero no es una buena práctica, por lo que es mejor enviar un JSON de strings
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
    ]
  });

  filter = signal('all');

  changeFilter(filter: string){
    this.filter.set(filter);
  }
  filtrarTareas = computed(() => { 
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pendientes') {
      return tasks.filter(task => !task.completed);
    }
    if (filter === 'completados') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })

  
  agregarTarea(){
    const regex = /^\s+$/;

    if(this.newTaskCtrl.valid && !regex.test(this.newTaskCtrl.value)){
      const value = this.newTaskCtrl.value.trim();
      const tarea = {
        id: Date.now(),
        title: value,
        completed: false,
        editing: false
      }
      this.tasks.update((tasks => [...tasks, tarea]));
    }
    
    this.newTaskCtrl.setValue('');
  }

  eliminarTarea(index: number){
    this.tasks.update((tasks) => tasks.filter((tasks, position) => position !== index));
  }

  completarTarea(index: number){
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
          if(position === index) {
            return {
              ...task,
              completed: !task.completed,
            }
          }
          return task;
      })
    })
  }

  modoEditarTarea(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
          if(position === index) {
            return {
              ...task,
              editing: true,
            }
          }
          return {
            ...task,
            editing:false,
          }
      })
    })
  }

  editarTarea(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
          if(position === index) {
            return {
              ...task,
              title: input.value,
              editing:false,
            }
          }
          return task;
      })
    })
  }
}

