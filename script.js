const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');


class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}


class Jogador extends Entidade {
    constructor() {
        super(canvas.width / 2 - 25, canvas.height - 60, 50, 50, 'blue');
        this.velocidade = 5;
    }

    mover(direcao) {
        if (direcao === 'esquerda' && this.x > 0) this.x -= this.velocidade;
        if (direcao === 'direita' && this.x + this.largura < canvas.width) this.x += this.velocidade;
    }
}


class Projetil extends Entidade {
    constructor(x, y) {
        super(x, y, 5, 10, 'yellow');
        this.velocidade = 7;
    }

    atualizar() {
        this.y -= this.velocidade;
    }
}


class Alien extends Entidade {
    constructor(x, y) {
        super(x, y, 40, 40, 'green');
        this.velocidade = 1;
    }

    atualizar() {
        this.y += this.velocidade;
    }
}


class Jogo {
    constructor() {
        this.jogador = new Jogador();
        this.projeteis = [];
        this.aliens = [];
        this.pontuacao = 0;
        this.gameOver = false;
        this.contadorAliens = 0;

        this.teclas = {};
        document.addEventListener('keydown', e => this.teclas[e.key] = true);
        document.addEventListener('keyup', e => this.teclas[e.key] = false);

        canvas.addEventListener('click', () => {
            this.atirar();
        });

        this.loop();
    }

    atirar() {
        const centroX = this.jogador.x + this.jogador.largura / 2 - 2.5;
        this.projeteis.push(new Projetil(centroX, this.jogador.y));
    }

    criarAlien() {
        const posX = Math.random() * (canvas.width - 40);
        this.aliens.push(new Alien(posX, -40));
    }

    checarColisao(a, b) {
        return (
            a.x < b.x + b.largura &&
            a.x + a.largura > b.x &&
            a.y < b.y + b.altura &&
            a.y + a.altura > b.y
        );
    }

    atualizar() {
        if (this.gameOver) return;

        
        if (this.teclas['ArrowLeft'] || this.teclas['a']) this.jogador.mover('esquerda');
        if (this.teclas['ArrowRight'] || this.teclas['d']) this.jogador.mover('direita');

        
        this.projeteis.forEach((proj, i) => {
            proj.atualizar();
            if (proj.y < 0) this.projeteis.splice(i, 1);
        });

        
        this.aliens.forEach((alien, i) => {
            alien.atualizar();

         
            if (this.checarColisao(alien, this.jogador)) {
                this.gameOver = true;
            }

            
            if (alien.y + alien.altura >= canvas.height) {
                this.gameOver = true;
            }

            
            this.projeteis.forEach((proj, j) => {
                if (this.checarColisao(alien, proj)) {
                    this.aliens.splice(i, 1);
                    this.projeteis.splice(j, 1);
                    this.pontuacao += 10;
                }
            });
        });

        
        this.contadorAliens++;
        if (this.contadorAliens % 100 === 0) {
            this.criarAlien();
        }
    }

    desenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.jogador.desenhar();

        this.projeteis.forEach(p => p.desenhar());
        this.aliens.forEach(a => a.desenhar());

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Pontuação: ${this.pontuacao}`, 10, 20);

        if (this.gameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '40px Arial';
            ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2);
        }
    }

    loop() {
        this.atualizar();
        this.desenhar();

        if (!this.gameOver) {
            requestAnimationFrame(() => this.loop());
        }
    }
}

const jogo = new Jogo();
