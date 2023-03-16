import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'verbal';
  questions = ['What is your name?', 'What is your favorite color?', 'Why you exist 🤔?'];
  recordings: { [key: string]: string } = {};
  recording: { [key: string]: boolean } = {};

  recordAnswer(question: string) {
    this.recording[question] = true;
    //navigator.mediaDevices.getUserMedia he wala user ch audio ch access sathi
    //then created mediarecorder object is created
    //and audio beimg recorded
    //
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', event => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const reader = new FileReader();

          reader.addEventListener('loadend', () => {
            this.recordings[question] = reader.result as string;
          });

          reader.readAsDataURL(blob);
        });

        setTimeout(() => {
          mediaRecorder.stop();
          this.recording[question] = false;
        }, 10000);
      });
  }

  submitAnswers() {
    const answers = [];

    for (const question of this.questions) {
      answers.push({
        question: question,
        answer: this.recordings[question]
      });
    }

    console.log(answers)

    // Send answers to server or store in local storage
  }

}
