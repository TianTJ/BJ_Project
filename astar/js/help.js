interface Alarm {
    alert()
}
interface Light {
    lightOn();
    lightOff();
}
class  Car implements Alarm,Light {
    public name;
    private myname;
    constructor(){

    }
}
class NewCar extends Car {
    constructor(){
        super()
    }
}