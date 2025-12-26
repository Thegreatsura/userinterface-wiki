"use client"

import { Slider } from "@base-ui/react/slider";
import { FloatingOverlay } from "@floating-ui/react";
import { Orb } from "@/components/orb";
import {
  FastForwardIcon,
  PlayIcon,
  RewindIcon,
  VoiceSettingsIcon,
  VolumeFullIcon,
} from "@/icons";
import { Button } from "../button";
import styles from "./styles.module.css";

const props = {
  icon: {
    large: {
      size: 24,
    },
    small: {
      size: 18,
    },
  },
};

export function Audio() {
  return (
    <FloatingOverlay className={styles.audio}>
      <div className={styles.details}>
        <div className={styles.cover}>
          <div className={styles.glow}>
            <Orb className={styles.canvas} />
          </div>
          <div className={styles.orb}>
            <Orb className={styles.canvas} />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>Page Title</div>
          <div className={styles.author}>Author Name</div>
        </div>
      </div>

      <div className={styles.progress}>
        <Slider.Root className={styles.root}>
          <Slider.Control className={styles.control}>
            <Slider.Track className={styles.track}>
              <Slider.Indicator className={styles.indicator} />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <div className={styles.time}>
          <span className={styles.current}>00:48</span>
          <span className={styles.duration}>03:15</span>
        </div>
      </div>

      <div className={styles.controls}>
        <Button variant="ghost" className={styles.button}>
          <VolumeFullIcon {...props.icon.small} />
        </Button>

        <div className={styles.options}>
          <Button variant="ghost" className={styles.button}>
            <RewindIcon {...props.icon.small} />
          </Button>
          <Button variant="ghost" className={styles.button}>
            <PlayIcon {...props.icon.large} />
          </Button>
          <Button variant="ghost" className={styles.button}>
            <FastForwardIcon {...props.icon.small} />
          </Button>
        </div>

        <Button variant="ghost" className={styles.button}>
          <VoiceSettingsIcon {...props.icon.large} />
        </Button>
      </div>
    </FloatingOverlay>
  );
}
