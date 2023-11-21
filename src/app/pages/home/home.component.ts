import { Component, importProvidersFrom, signal, computed } from '@angular/core';
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
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Instalar Angular CLI',
      completed: false,
      editing: false,
    },
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false,
      editing: false,
    },
  ]);

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

