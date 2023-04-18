export class CheckpointManager {
    private checkpointid: number = 0;
    private checkpointType: number = 0;
    private checkpointPosition: Vector3 = new mp.Vector3(0, 0, 0);
    private checkpointDirection: Vector3 = new mp.Vector3(0, 0, 0);
    private checkpointVisible: boolean = true;
    private checkpointDimension: number = 0;
    private checkpointHandle: CheckpointMp | null = null;
    private blipHandle: BlipMp | null = null;
    private checkpointRadius: any = 2.0;

    setPlayerCheckpoint(checkpointid: number, checkpointType: number, position: Vector3, direction: Vector3, radius: any, status: boolean, dimension: number) {
        this.checkpointType = checkpointType;
        this.checkpointPosition = position;
        this.checkpointDirection = direction;
        this.checkpointVisible = status;
        this.checkpointDimension = dimension;
        this.checkpointRadius = radius;
        this.checkpointid = checkpointid;

        this.checkpointHandle = mp.checkpoints.new(this.checkpointType, new mp.Vector3(this.checkpointPosition.x, this.checkpointPosition.y, this.checkpointPosition.z-1.0), this.checkpointRadius, {
            color: [144, 0, 255, 200],
            visible: this.checkpointVisible,
            dimension: this.checkpointDimension,
            direction: this.checkpointDirection
        });

        this.blipHandle = mp.blips.new(1, this.checkpointPosition, { name: 'Checkpoint', color: 83, shortRange: false });
        this.blipHandle.setRoute(true);
        
    }

    destroyPlayerCheckpoint() {
        if (this.checkpointHandle) {
            this.checkpointHandle.destroy();
            this.checkpointHandle = null;
            this.checkpointid = 0;

            this.blipHandle?.destroy();
            this.blipHandle = null;
        }
    }

    isPlayerEnterCheckpoint(checkpointid: any) {
        return checkpointid === this.checkpointid;
    }

    playSoundEnterCheckpoint() {
        mp.game.audio.playSoundFrontend(-1, "RACE_PLACED", "HUD_AWARDS", true);
    }
}
