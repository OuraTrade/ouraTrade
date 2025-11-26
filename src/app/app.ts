import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ScrollToTop } from './components/scroll-to-top/scroll-to-top';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ScrollToTop, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
