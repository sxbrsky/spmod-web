<?php
    namespace App;

    class View 
    {
        public static function render($template, $args = [])
        {
            static $twig = null;

            if ($twig == null) {
                $loader = new \Twig_Loader_Filesystem($_SERVER['DOCUMENT_ROOT'].'/templates/');
                $twig = new \Twig_Environment($loader, [
                        'auto_reload' => true
                        #'cache' => $_SERVER['DOCUMENT_ROOT'].'/cache/'
                    ]
                );
            }
            
            echo $twig->render($template, $args);
        }
    }