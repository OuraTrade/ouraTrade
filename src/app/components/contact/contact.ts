import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  email = signal('');
  subject = signal('');
  message = signal('');

  onSubmit() {
    // Handle form submission
    console.log('Form submitted:', {
      email: this.email(),
      subject: this.subject(),
      message: this.message()
    });
  }
}

