// Seleciona os elementos do HTML pelos IDs e Classes
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const navItems = document.querySelectorAll('.nav-item');

// Função para alternar o estado do menu (Abrir/Fechar)
function toggleMenu() {
  const isOpen = menuToggle.classList.toggle('open');
  navLinks.classList.toggle('active');
  navOverlay.classList.toggle('active');
  
  // Atualiza a acessibilidade: se a classe 'open' existe, está expandido (true)
  menuToggle.setAttribute('aria-expanded', isOpen);
  
  // // Atualiza o texto descritivo para leitores de tela
  // if (isOpen) {
  //   menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
  // } else {
  //   menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
  // }
}

// Função para fechar o menu obrigatoriamente
function closeMenu() {
  menuToggle.classList.remove('open');
  navLinks.classList.remove('active');
  navOverlay.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  // menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
}

// 1. Escuta o clique no botão Hamburguer
menuToggle.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', closeMenu);

// 2. Fecha o menu automaticamente quando qualquer link interno for clicado
navItems.forEach(item => {
  item.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    closeMenu();
    menuToggle.focus(); // Devolve o foco do teclado para o botão principal
  }
});