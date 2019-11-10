<?php
    namespace App\Model;

    use App\Base\Model;

    class Builds extends Model
    {
        public function save($commit_id, $build, $system, $version, $compiler, $type, $filename)
        {
            $sql = "INSERT INTO builds(`commit_id`, `build`, `system`, `version`, compiler, `type`, `filename` VALUES ? ? ? ? ? ? ?";

            return $this->getDb()->prepare($sql)->execute([$commit_id, $build, $system, $version, $compiler, $type, $filename]);
        }
    }