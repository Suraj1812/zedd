import React, { useState } from "react";
import { Modal, View, Pressable } from "react-native";
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isBefore,
  startOfDay,
  format,
  parseISO,
  isValid,
} from "date-fns";
import { T, Row, Icon, Tap, RoundButton } from "./ui";
import { colors as c } from "../theme";
export function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(parseISO(value)));
  const selected = parseISO(value);
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  const cells = [...Array(getDay(startOfMonth(month))).fill(null), ...days];
  return (
    <View style={{ gap: 8, marginBottom: 20 }}>
      <T size={14} weight="medium">
        {label}
      </T>
      <Tap
        label={label}
        onPress={() => setOpen(true)}
        style={{
          padding: 15,
          borderWidth: 1,
          borderColor: error ? c.red : c.line,
          borderRadius: 13,
          backgroundColor: c.white,
        }}
      >
        <Row style={{ gap: 10 }}>
          <Icon name="calendar" size={20} color={c.primary} />
          <T style={{ flex: 1 }}>
            {isValid(selected)
              ? format(selected, "EEE, d MMM yyyy")
              : "Choose a date"}
          </T>
          <Icon name="down" size={16} />
        </Row>
      </Tap>
      {!!error && (
        <T color={c.red} size={13}>
          {error}
        </T>
      )}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(13,32,22,.4)",
            alignItems: "center",
            justifyContent: "center",
            padding: 22,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: c.white,
              width: "100%",
              maxWidth: 370,
              padding: 22,
              borderRadius: 25,
            }}
          >
            <Row style={{ justifyContent: "space-between", marginBottom: 20 }}>
              <T size={20} weight="display">
                {format(month, "MMMM yyyy")}
              </T>
              <Row style={{ gap: 8 }}>
                <RoundButton
                  icon="left"
                  label="Previous month"
                  onPress={() => setMonth(addMonths(month, -1))}
                />
                <RoundButton
                  icon="right"
                  label="Next month"
                  onPress={() => setMonth(addMonths(month, 1))}
                />
              </Row>
            </Row>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <View
                  key={i}
                  style={{ width: "14.285%", alignItems: "center" }}
                >
                  <T size={12} color={c.muted}>
                    {d}
                  </T>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {cells.map((day, i) => {
                const chosen = day && format(day, "yyyy-MM-dd") === value;
                const past = day && isBefore(day, startOfDay(new Date()));
                return (
                  <View key={i} style={{ width: "14.285%", padding: 3 }}>
                    {day ? (
                      <Tap
                        disabled={past}
                        label={format(day, "EEEE, d MMMM yyyy")}
                        onPress={() => {
                          onChange(format(day, "yyyy-MM-dd"));
                          setOpen(false);
                        }}
                        style={{
                          height: 37,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 12,
                          backgroundColor: chosen ? c.primary : c.white,
                        }}
                      >
                        <T
                          size={14}
                          weight={chosen ? "bold" : "regular"}
                          color={chosen ? c.white : past ? "#BDC4BD" : c.ink}
                        >
                          {format(day, "d")}
                        </T>
                      </Tap>
                    ) : (
                      <View style={{ height: 37 }} />
                    )}
                  </View>
                );
              })}
            </View>
            <Tap
              label="Close calendar"
              onPress={() => setOpen(false)}
              style={{ alignSelf: "center", padding: 15, marginTop: 8 }}
            >
              <T color={c.primary} weight="bold" size={14}>
                Done
              </T>
            </Tap>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
