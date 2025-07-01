import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { IAuthority, ILoginResponse, IRoleType, IUser } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: "", authorities: [] };
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.load();
  }

  private save(): void {
    localStorage.setItem("access_token", this.accessToken); // ✅ sin stringify
    localStorage.setItem("expiresIn", JSON.stringify(this.expiresIn));
    localStorage.setItem("auth_user", JSON.stringify(this.user));
  }

  private load(): void {
    const token = localStorage.getItem("access_token");
    const exp = localStorage.getItem("expiresIn");
    const user = localStorage.getItem("auth_user");

    if (token) this.accessToken = token;
    if (exp) this.expiresIn = JSON.parse(exp);
    if (user) this.user = JSON.parse(user);
  }

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken || null;
  }

  public check(): boolean {
    return !!this.accessToken;
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>("auth/login", credentials).pipe(
      tap((response: ILoginResponse) => {
        this.accessToken = response.accessToken; // ✅ CORREGIDO
        this.expiresIn = response.expiresIn;
        this.user.email = credentials.email;
        this.save();
      })
    );
  }

  public signup(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>("auth/signup", user);
  }

  public logout(): void {
    this.accessToken = "";
    localStorage.removeItem("access_token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("auth_user");
  }

  public hasRole(role: string): boolean {
    return this.user.authorities?.some((a) => a.authority === role) ?? false;
  }

  public isSuperAdmin(): boolean {
    return this.hasRole(IRoleType.superAdmin);
  }

  public hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    return routes.filter(
      (route) =>
        route.data?.authorities && this.hasAnyRole(route.data.authorities)
    );
  }

  public getUserAuthorities(): IAuthority[] {
    return this.user.authorities || [];
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean {
    const userAuthorities = this.getUserAuthorities();
    const allowedUser = routeAuthorities.some((auth) =>
      userAuthorities.some((u) => u.authority === auth)
    );
    const isAdmin = userAuthorities.some(
      (u) =>
        u.authority === IRoleType.admin || u.authority === IRoleType.superAdmin
    );
    return allowedUser && isAdmin;
  }
}
