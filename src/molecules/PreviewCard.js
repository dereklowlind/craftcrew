import { ReactTinyLink } from "react-tiny-link";

function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

function PreviewCard(props){  
    if(isValidHttpUrl(props.url)){
        const pattern = /https:\/\/www\.youtube\.com\/watch\?v=(.+)/;
        const isYoutube = pattern.exec(props.url);
        if(isYoutube !== null){
            return(
                <iframe src={"https://www.youtube.com/embed/"+isYoutube[1]} 
                    allowfullscreen="allowfullscreen"
                    width="420" height="345"
                />
            )
        }else{
            return(
                <ReactTinyLink
                    cardSize="small"
                    showGraphic={true}
                    maxLine={2}
                    minLine={1}
                    url={props.url}
                />
    
            )
        }
    }else{
        return(
            <div style={{
                color: "grey",
                borderColor: "grey",
                borderWidth: "2px",
                borderStyle: "solid",
                marginTop: "4px",
                padding: "10px",
                textAlign: "center",
                fontSize: "50px"
            }}>404 Invalid Url</div>
    
        )
    }
}
export default PreviewCard