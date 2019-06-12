<?php
    require_once(__DIR__.'/vendor/autoload.php');

    $core = new App\Core();
    $builds = $core->getData();

    App\View::render('index.twig', [
        'builds' => $builds
    ]);