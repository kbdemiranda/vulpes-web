import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AutenticacaoService} from "../../services/autenticacao.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  // username: string = 'kbdemiranda@hotmail.com';
  // password: string = '!yQ8nwmaaZ_g';


  constructor(
    private formBuilder: FormBuilder,
    private authService: AutenticacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    })
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.autenticar(email, password).subscribe({
      next: (value) => {
        console.log('Autenticado com sucesso', value)

        this.router.navigateByUrl('/').then(r => console.log('navegou'))
        this.loginForm.reset();
      },
      error: (err) => {
        console.log('Problema na autenticação', err)
      },
    })
  }
}
