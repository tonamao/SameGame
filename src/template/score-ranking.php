<div class="modal fade modal-dialog-centered" id="clearModal" tabindex="-1" role="dialog" aria-labelledby="clear-label" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-overlay">
            <div class="modal-content" id="modalContent">
                <div class="modal-header">
                    <h5 class="modal-title" id="clear-label">SCORE RESULT</h5>
                    <button type="button" class="close clear-modal-close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="clearModalBody">
                        <h4>Your Score : <div id="modalScore" class="modal-score"></div></h4>
                    </div>
                    <div class="clear-modal-body ranking">
                        <?php
                            include( __DIR__ . '/../util/api/Helper.php');
                            $query = [
                                    'sort' => 'score-',
                                    'limit' => '10',
                            ];
                            $helper = Helper::getInstance($query);
                            $score_history = $helper->get($query);
                        ?>
                        <table class="table table-sm table-bordered">
                                <?php if (!empty($score_history)) { ?>
                                <h5>SCORE RANKING</h5>
                                <thead>
                                    <tr align="center">
                                        <th scope="col">RANK</th>
                                        <th scope="col">NAME</th>
                                        <th scope="col">SCORE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach($score_history->scoreHistoryList as $key => $history): ?>
                                        <tr>
                                            <td scope="row" align="center"></td>
                                            <td>
                                                <?php
                                                    $name = $history->guestName;
                                                    if (!$name) {
                                                        $name_list = ["Pikachu", "Fred", "Jonson", "Lombardi", "Laura", "Eliza", "Rosa", "Apple", "Peach", "Dr,MARIO"];
                                                        $name_index = rand(0, count($name_list) - 1);
                                                        $name = 'ナナシ_'.$name_list[$name_index];
                                                    }
                                                    echo $name;
                                                ?>
                                            </td>
                                            <td align="right"><?php echo $history->score; ?></td>
                                        </tr>
                                    <?php endforeach;
                                    }
                                    ?>
                                <tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary clear-modal-close" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary clear-modal-close">OK</button>
                </div>
            </div>
        </div>
    </div>
</div>
