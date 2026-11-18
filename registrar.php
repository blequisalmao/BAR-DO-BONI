<?php
// Registra cada abertura da apresentação num arquivo de log FORA da pasta pública
// (~/logs-apresentacoes/bar-do-boni.log no servidor), uma linha por abertura:
//   ABRIU A APRESENTACAO EM: 18/11/2026 14:32:05 | celular · Android · Chrome
// Chamado pela própria apresentação (navigator.sendBeacon, uma vez ao abrir). Não guarda IP nem dado pessoal:
// só o horário (Brasília) e o tipo de aparelho, deduzido do navegador.

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit;
}

$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 400);
// robôs e pré-visualizações de link não contam
if ($ua === '' || preg_match('/bot|crawl|spider|preview|headless|lighthouse/i', $ua)) {
    http_response_code(204);
    exit;
}

$aparelho = preg_match('/iPad|Tablet/i', $ua) || (preg_match('/Android/i', $ua) && !preg_match('/Mobile/i', $ua))
    ? 'tablet'
    : (preg_match('/Mobi|iPhone|Android/i', $ua) ? 'celular' : 'computador');

$sistema = 'outro sistema';
foreach (['iPhone' => 'iPhone', 'iPad' => 'iPad', 'Android' => 'Android', 'Windows' => 'Windows', 'Mac OS X' => 'Mac', 'Linux' => 'Linux'] as $marca => $nome) {
    if (stripos($ua, $marca) !== false) { $sistema = $nome; break; }
}

$navegador = 'outro navegador';
foreach (['Instagram' => 'Instagram', 'FBAN' => 'Facebook', 'SamsungBrowser' => 'Samsung Internet', 'Edg/' => 'Edge', 'OPR/' => 'Opera',
          'Firefox' => 'Firefox', 'CriOS' => 'Chrome', 'Chrome' => 'Chrome', 'Safari' => 'Safari'] as $marca => $nome) {
    if (strpos($ua, $marca) !== false) { $navegador = $nome; break; }
}

$horario = (new DateTime('now', new DateTimeZone('America/Sao_Paulo')))->format('d/m/Y H:i:s');
$linha = "ABRIU A APRESENTACAO EM: {$horario} | {$aparelho} · {$sistema} · {$navegador}\n";

// /home/<conta>/domains/<dominio>/public_html/<pasta>/registrar.php → /home/<conta>/logs-apresentacoes
$pasta = dirname(__DIR__, 4) . '/logs-apresentacoes';
if (!is_dir($pasta)) {
    @mkdir($pasta, 0700, true);
}
@file_put_contents($pasta . '/bar-do-boni.log', $linha, FILE_APPEND | LOCK_EX);

http_response_code(204);
