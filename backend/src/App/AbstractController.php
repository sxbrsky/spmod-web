<?php
    namespace App\Base;

    use App\Base\Database;
    use App\Base\Kernel;

    abstract class AbstractController
    {
        protected $db;
        protected $kernel;
        
        public function __construct()
        {
            $this->db = new Database();
            $this->kernel = new Kernel();
        }

        public function getKernel()
        {
            return $this->kernel;
        }
    }