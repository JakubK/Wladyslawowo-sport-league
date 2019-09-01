import Vue from "vue";

//Max 100 chars

Vue.filter("reduceText", value => {
  if(value)
  {
    if ( value.length >= 100) {
      return value.substring(0, 100) + "...";
    } else {
      return value;
    }
  }
});

//Max 400 chars

Vue.filter("reduceTextLonger", value => {
  if ( value.length >= 400) {
    return value.substring(0, 400) + "...";
  } else {
    return value;
  }
});
